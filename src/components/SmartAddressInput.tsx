/**
 * Smart Address Autocomplete
 * 
 * Research-backed implementation:
 * - BigCommerce: Smart form fills significantly reduce failed deliveries
 * - Loqate research: Real-time address validation speeds checkout
 * - Reduces input errors and checkout time
 * - Increases conversion by reducing friction
 * 
 * Features:
 * 1. Address suggestions as user types
 * 2. ZIP code auto-lookup for city/state
 * 3. Address validation with error feedback
 * 4. Browser autofill compatibility
 * 5. Mobile-optimized with large touch targets
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  MagnifyingGlass,
  CheckCircle,
  WarningCircle,
  CaretDown,
  Spinner,
  House,
  Buildings,
  MapTrifold
} from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { trackEvent } from '@/lib/analytics'

// ============================================================================
// Types
// ============================================================================

interface AddressSuggestion {
  id: string
  text: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  type: 'residential' | 'commercial' | 'po-box'
}

interface AddressComponents {
  address1: string
  address2: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface SmartAddressInputProps {
  value: AddressComponents
  onChange: (address: AddressComponents) => void
  onValidation?: (isValid: boolean, errors: string[]) => void
  label?: string
  placeholder?: string
  required?: boolean
  className?: string
  countryCode?: string
}

interface ZipCodeLookupProps {
  zipCode: string
  onCityStateFound: (city: string, state: string) => void
}

// ============================================================================
// Constants
// ============================================================================

// US State abbreviations for validation
const US_STATES: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'Washington D.C.'
}

// Mock ZIP code database (in production, use a real API like Loqate, SmartyStreets, or Google Places)
const ZIP_CODE_DATABASE: Record<string, { city: string; state: string }> = {
  '10001': { city: 'New York', state: 'NY' },
  '10002': { city: 'New York', state: 'NY' },
  '90210': { city: 'Beverly Hills', state: 'CA' },
  '90211': { city: 'Beverly Hills', state: 'CA' },
  '02101': { city: 'Boston', state: 'MA' },
  '02102': { city: 'Boston', state: 'MA' },
  '60601': { city: 'Chicago', state: 'IL' },
  '60602': { city: 'Chicago', state: 'IL' },
  '77001': { city: 'Houston', state: 'TX' },
  '77002': { city: 'Houston', state: 'TX' },
  '85001': { city: 'Phoenix', state: 'AZ' },
  '85002': { city: 'Phoenix', state: 'AZ' },
  '19101': { city: 'Philadelphia', state: 'PA' },
  '19102': { city: 'Philadelphia', state: 'PA' },
  '78201': { city: 'San Antonio', state: 'TX' },
  '78202': { city: 'San Antonio', state: 'TX' },
  '92101': { city: 'San Diego', state: 'CA' },
  '92102': { city: 'San Diego', state: 'CA' },
  '75201': { city: 'Dallas', state: 'TX' },
  '75202': { city: 'Dallas', state: 'TX' },
  '95101': { city: 'San Jose', state: 'CA' },
  '95102': { city: 'San Jose', state: 'CA' },
  '78701': { city: 'Austin', state: 'TX' },
  '78702': { city: 'Austin', state: 'TX' },
  '98101': { city: 'Seattle', state: 'WA' },
  '98102': { city: 'Seattle', state: 'WA' },
  '80201': { city: 'Denver', state: 'CO' },
  '80202': { city: 'Denver', state: 'CO' },
  '33101': { city: 'Miami', state: 'FL' },
  '33102': { city: 'Miami', state: 'FL' },
  '30301': { city: 'Atlanta', state: 'GA' },
  '30302': { city: 'Atlanta', state: 'GA' },
  '97201': { city: 'Portland', state: 'OR' },
  '97202': { city: 'Portland', state: 'OR' },
}

// Mock address suggestions (in production, use Google Places API or similar)
const generateMockSuggestions = (query: string): AddressSuggestion[] => {
  if (query.length < 3) return []
  
  const streets = [
    '123 Main Street',
    '456 Oak Avenue',
    '789 Maple Drive',
    '321 Pine Lane',
    '654 Cedar Road',
    '987 Elm Street',
    '147 Birch Boulevard',
    '258 Willow Way'
  ]
  
  const cities = [
    { city: 'New York', state: 'NY', zip: '10001' },
    { city: 'Los Angeles', state: 'CA', zip: '90001' },
    { city: 'Chicago', state: 'IL', zip: '60601' },
    { city: 'Houston', state: 'TX', zip: '77001' },
    { city: 'Phoenix', state: 'AZ', zip: '85001' },
    { city: 'Seattle', state: 'WA', zip: '98101' },
  ]
  
  return streets
    .filter(s => s.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5)
    .map((street, i) => {
      const cityInfo = cities[i % cities.length]
      return {
        id: `suggestion-${i}`,
        text: `${street}, ${cityInfo.city}, ${cityInfo.state} ${cityInfo.zip}`,
        address: {
          street,
          city: cityInfo.city,
          state: cityInfo.state,
          zipCode: cityInfo.zip,
          country: 'US'
        },
        type: i % 3 === 0 ? 'commercial' : 'residential' as const
      }
    })
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Validates a US ZIP code format
 */
function isValidZipCode(zip: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(zip)
}

/**
 * Validates a US state abbreviation
 */
function isValidState(state: string): boolean {
  return state.toUpperCase() in US_STATES
}

/**
 * Formats a phone number as user types
 */
export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/)
  
  if (!match) return value
  
  const [, area, prefix, line] = match
  
  if (line) return `(${area}) ${prefix}-${line}`
  if (prefix) return `(${area}) ${prefix}`
  if (area) return `(${area}`
  
  return value
}

/**
 * Validates a complete address
 */
function validateAddress(address: AddressComponents): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!address.address1?.trim()) {
    errors.push('Street address is required')
  }
  
  if (!address.city?.trim()) {
    errors.push('City is required')
  }
  
  if (!address.state?.trim()) {
    errors.push('State is required')
  } else if (!isValidState(address.state)) {
    errors.push('Please enter a valid state abbreviation')
  }
  
  if (!address.zipCode?.trim()) {
    errors.push('ZIP code is required')
  } else if (!isValidZipCode(address.zipCode)) {
    errors.push('Please enter a valid ZIP code')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// ============================================================================
// ZIP Code Lookup Hook
// ============================================================================

function useZipCodeLookup(zipCode: string, onFound: (city: string, state: string) => void) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const previousZip = useRef<string>('')

  useEffect(() => {
    // Only lookup when we have a valid 5-digit ZIP
    if (!isValidZipCode(zipCode) || zipCode === previousZip.current) {
      return
    }

    previousZip.current = zipCode
    setIsLoading(true)
    setError(null)

    // Simulate API call (in production, use real API)
    const lookup = async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const cleanZip = zipCode.substring(0, 5)
      const result = ZIP_CODE_DATABASE[cleanZip]
      
      if (result) {
        onFound(result.city, result.state)
        trackEvent('zip_code_autofill', { zip: cleanZip, city: result.city, state: result.state })
      } else {
        // For unknown ZIPs, don't show error - just let user type
        setError(null)
      }
      
      setIsLoading(false)
    }

    lookup()
  }, [zipCode, onFound])

  return { isLoading, error }
}

// ============================================================================
// Address Suggestion Dropdown
// ============================================================================

interface AddressSuggestionDropdownProps {
  suggestions: AddressSuggestion[]
  onSelect: (suggestion: AddressSuggestion) => void
  isLoading: boolean
  visible: boolean
}

function AddressSuggestionDropdown({ 
  suggestions, 
  onSelect, 
  isLoading, 
  visible 
}: AddressSuggestionDropdownProps) {
  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute z-50 w-full mt-1 bg-white border border-sage-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
      >
        {isLoading ? (
          <div className="p-4 text-center text-sage-500">
            <Spinner className="w-5 h-5 animate-spin mx-auto" />
            <p className="text-sm mt-2">Finding addresses...</p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="p-4 text-center text-sage-500">
            <p className="text-sm">No addresses found. Please enter manually.</p>
          </div>
        ) : (
          <ul role="listbox" aria-label="Address suggestions">
            {suggestions.map((suggestion) => {
              const TypeIcon = suggestion.type === 'commercial' ? Buildings : House
              
              return (
                <li
                  key={suggestion.id}
                  role="option"
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-sage-50 transition-colors border-b border-sage-100 last:border-b-0"
                  onClick={() => onSelect(suggestion)}
                >
                  <TypeIcon weight="duotone" className="w-5 h-5 text-sage-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sage-800 truncate">
                      {suggestion.address.street}
                    </p>
                    <p className="text-xs text-sage-500">
                      {suggestion.address.city}, {suggestion.address.state} {suggestion.address.zipCode}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================================================
// Smart Address Input Component
// ============================================================================

export function SmartAddressInput({
  value,
  onChange,
  onValidation,
  label = "Address",
  placeholder = "Start typing your address...",
  required = false,
  className = '',
  countryCode = 'US'
}: SmartAddressInputProps) {
  const [query, setQuery] = useState(value.address1 || '')
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [validationState, setValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)

  // Handle ZIP code autofill
  const handleCityStateFound = useCallback((city: string, state: string) => {
    onChange({
      ...value,
      city: value.city || city,
      state: value.state || state
    })
  }, [value, onChange])

  const { isLoading: zipLoading } = useZipCodeLookup(value.zipCode, handleCityStateFound)

  // Handle address search
  const handleAddressSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery)
    onChange({ ...value, address1: searchQuery })

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    if (searchQuery.length >= 3) {
      setIsSearching(true)
      setShowSuggestions(true)

      // Debounce the search
      searchTimeout.current = setTimeout(() => {
        const results = generateMockSuggestions(searchQuery)
        setSuggestions(results)
        setIsSearching(false)
      }, 300)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [value, onChange])

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: AddressSuggestion) => {
    const newAddress: AddressComponents = {
      address1: suggestion.address.street,
      address2: '',
      city: suggestion.address.city,
      state: suggestion.address.state,
      zipCode: suggestion.address.zipCode,
      country: suggestion.address.country
    }

    setQuery(suggestion.address.street)
    onChange(newAddress)
    setShowSuggestions(false)
    setValidationState('valid')

    trackEvent('address_autocomplete_selected', {
      type: suggestion.type
    })

    // Move focus to next field
    const nextInput = containerRef.current?.querySelector('[data-next-field]') as HTMLInputElement
    nextInput?.focus()
  }, [onChange])

  // Validate on blur
  const handleBlur = useCallback(() => {
    setIsFocused(false)
    setTimeout(() => setShowSuggestions(false), 200) // Delay to allow click on suggestion

    const validation = validateAddress(value)
    setValidationState(validation.isValid ? 'valid' : 'invalid')
    onValidation?.(validation.isValid, validation.errors)
  }, [value, onValidation])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className={`space-y-4 ${className}`}>
      {/* Street Address */}
      <div className="relative">
        <Label htmlFor="address1" className="text-sm font-medium text-sage-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative mt-1">
          <MapPin 
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors
              ${isFocused ? 'text-sage-600' : 'text-sage-400'}
            `}
          />
          <Input
            ref={inputRef}
            id="address1"
            type="text"
            value={query}
            onChange={(e) => handleAddressSearch(e.target.value)}
            onFocus={() => {
              setIsFocused(true)
              if (query.length >= 3) setShowSuggestions(true)
            }}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="pl-10 pr-10 h-12"
            autoComplete="street-address"
            required={required}
          />
          
          {validationState === 'valid' && (
            <CheckCircle 
              weight="fill" 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" 
            />
          )}
          {validationState === 'invalid' && (
            <WarningCircle 
              weight="fill" 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" 
            />
          )}
        </div>

        <AddressSuggestionDropdown
          suggestions={suggestions}
          onSelect={handleSuggestionSelect}
          isLoading={isSearching}
          visible={showSuggestions}
        />
      </div>

      {/* Apartment/Suite */}
      <div>
        <Label htmlFor="address2" className="text-sm font-medium text-sage-700">
          Apartment, suite, etc. (optional)
        </Label>
        <Input
          id="address2"
          data-next-field
          type="text"
          value={value.address2}
          onChange={(e) => onChange({ ...value, address2: e.target.value })}
          placeholder="Apt, Suite, Unit, Building, Floor, etc."
          className="h-12 mt-1"
          autoComplete="address-line2"
        />
      </div>

      {/* City, State, ZIP */}
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-3">
          <Label htmlFor="city" className="text-sm font-medium text-sage-700">
            City {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="city"
            type="text"
            value={value.city}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
            placeholder="City"
            className="h-12 mt-1"
            autoComplete="address-level2"
            required={required}
          />
        </div>

        <div className="col-span-1">
          <Label htmlFor="state" className="text-sm font-medium text-sage-700">
            State {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="state"
            type="text"
            value={value.state}
            onChange={(e) => onChange({ ...value, state: e.target.value.toUpperCase().slice(0, 2) })}
            placeholder="ST"
            className="h-12 mt-1 text-center uppercase"
            autoComplete="address-level1"
            maxLength={2}
            required={required}
          />
        </div>

        <div className="col-span-2 relative">
          <Label htmlFor="zipCode" className="text-sm font-medium text-sage-700">
            ZIP Code {required && <span className="text-red-500">*</span>}
          </Label>
          <div className="relative">
            <Input
              id="zipCode"
              type="text"
              value={value.zipCode}
              onChange={(e) => onChange({ ...value, zipCode: e.target.value.replace(/\D/g, '').slice(0, 9) })}
              placeholder="12345"
              className="h-12 mt-1"
              autoComplete="postal-code"
              maxLength={10}
              required={required}
            />
            {zipLoading && (
              <Spinner className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-sage-400" />
            )}
          </div>
        </div>
      </div>

      {/* Validation hint */}
      {validationState === 'invalid' && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-red-600"
        >
          <WarningCircle weight="fill" className="w-4 h-4" />
          <span>Please complete all required address fields</span>
        </motion.div>
      )}
    </div>
  )
}

// ============================================================================
// Compact Address Display
// ============================================================================

interface AddressDisplayProps {
  address: AddressComponents
  onEdit?: () => void
  className?: string
}

export function AddressDisplay({ address, onEdit, className }: AddressDisplayProps) {
  const hasAddress = address.address1 && address.city && address.state && address.zipCode

  if (!hasAddress) {
    return null
  }

  return (
    <div className={`bg-sage-50 rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <MapTrifold weight="duotone" className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-sage-800">{address.address1}</p>
            {address.address2 && <p className="text-sage-600">{address.address2}</p>}
            <p className="text-sage-600">
              {address.city}, {address.state} {address.zipCode}
            </p>
          </div>
        </div>
        
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-sage-600 hover:text-sage-800 font-medium underline"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Export all utilities
// ============================================================================

export {
  validateAddress,
  isValidZipCode,
  isValidState,
  US_STATES
}

export type {
  AddressComponents,
  AddressSuggestion
}
