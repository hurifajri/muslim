'use client';

import { useQueryClient } from '@tanstack/react-query';
import {
  CheckIcon,
  LoaderIcon,
  MapPinIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useLocationStore } from '@/providers/location-store-provider';
import {
  reverseGeocodeQueryOptions,
  searchLocationsQueryOptions,
} from '@/queries/nominatim';
import type { LocationSuggestion } from '@/schemas/nominatim';

// ─── Types ────────────────────────────────────────────────────────────────────

type GeoState = 'idle' | 'loading' | 'error';

export type LocationProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
}>;

// ─── Shared Form Body ─────────────────────────────────────────────────────────

type LocationFormProps = Readonly<{
  isMobile?: boolean;
  query: string;
  suggestions: LocationSuggestion[];
  selected: LocationSuggestion | null;
  isSearching: boolean;
  geoState: GeoState;
  geoError: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onQueryChange: (value: string) => void;
  onSelect: (suggestion: LocationSuggestion) => void;
  onClear: () => void;
  onUseGeolocation: () => void;
}>;

function LocationForm({
  isMobile = false,
  query,
  suggestions,
  selected,
  isSearching,
  geoState,
  geoError,
  inputRef,
  onQueryChange,
  onSelect,
  onClear,
  onUseGeolocation,
}: LocationFormProps) {
  const showDropdown = suggestions.length > 0 && !selected;

  return (
    <div className={cn('flex flex-col gap-3', isMobile && 'p-4')}>
      {/* Search input */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="city-search">Lokasi</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            {isSearching ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <SearchIcon className="size-4" />
            )}
          </InputGroupAddon>

          <InputGroupInput
            id="city-search"
            ref={inputRef}
            placeholder="Cari kota…"
            value={query}
            autoComplete="off"
            onChange={e => onQueryChange(e.target.value)}
            className="capitalize"
          />

          {query && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={onClear}
                aria-label="Hapus pencarian"
              >
                <XIcon className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        {/* Suggestions dropdown */}
        {showDropdown && (
          <ItemGroup className="mt-1 max-h-48 gap-0! overflow-y-auto rounded-2xl">
            {suggestions.map(s => (
              <Item
                key={s.placeId}
                role="option"
                aria-selected={false}
                tabIndex={0}
                variant="default"
                size="xs"
                onClick={() => onSelect(s)}
                onKeyDown={e =>
                  (e.key === 'Enter' || e.key === ' ') && onSelect(s)
                }
              >
                <ItemContent>
                  <ItemTitle className="line-clamp-1 capitalize">
                    {s.city} - <span className="capitalize">{s.country}</span>
                  </ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        )}

        {/* Selected badge */}
        {selected && (
          <p className="flex items-center gap-1 text-xs">
            <CheckIcon className="size-3 shrink-0" />
            <span>
              <span className="font-medium capitalize">{selected.city}</span>
              {', '}
              {selected.country}
            </span>
          </p>
        )}
      </div>

      {/* Geolocation button */}
      <Button
        type="button"
        variant="ghost"
        onClick={onUseGeolocation}
        disabled={geoState === 'loading'}
        className="justify-start"
      >
        {geoState === 'loading' ? (
          <LoaderIcon className="size-4 animate-spin" />
        ) : (
          <MapPinIcon className="size-4" />
        )}
        {geoState === 'loading' ? 'Mendeteksi lokasi…' : 'Gunakan lokasi saya'}
      </Button>

      {/* Geo error */}
      {geoState === 'error' && (
        <p className="text-destructive text-xs">{geoError}</p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Location({ isOpen, onClose }: LocationProps) {
  const queryClient = useQueryClient();

  const {
    city: savedCity,
    country: savedCountry,
    setCity: saveCity,
    setCountry: saveCountry,
  } = useLocationStore(state => state);

  const { isMobile } = useIsMobile();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [selected, setSelected] = useState<LocationSuggestion | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [geoState, setGeoState] = useState<GeoState>('idle');
  const [geoError, setGeoError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (!isOpen) return;
    const timeout = setTimeout(() => {
      setQuery(savedCity);
      setSelected({
        placeId: 0,
        displayName: savedCity,
        city: savedCity,
        country: savedCountry,
        countryCode: savedCountry,
      });
      setSuggestions([]);
      setGeoState('idle');
      setGeoError('');
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(timeout);
  }, [isOpen, savedCity, savedCountry]);

  // Debounced search
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelected(null);
    setSuggestions([]);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (value.trim().length < 2) return;
      setIsSearching(true);
      try {
        const results = await queryClient.fetchQuery(
          searchLocationsQueryOptions(value)
        );
        setSuggestions(results);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const handleSelect = (s: LocationSuggestion) => {
    setSelected(s);
    setQuery(s.city);
    setSuggestions([]);
  };

  const handleClear = () => {
    setQuery('');
    setSelected(null);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoState('error');
      setGeoError('Browser tidak mendukung geolokasi.');
      return;
    }
    setGeoState('loading');
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const result = await queryClient.fetchQuery(
            reverseGeocodeQueryOptions(
              pos.coords.latitude,
              pos.coords.longitude
            )
          );
          if (!result)
            throw new Error('Location not found for the given coordinates.');
          handleSelect(result);
          setGeoState('idle');
        } catch {
          setGeoState('error');
          setGeoError('Gagal mendapatkan nama kota dari koordinat.');
        }
      },
      err => {
        const messages: Record<number, string> = {
          1: 'Izin lokasi ditolak. Aktifkan di pengaturan browser.',
          2: 'Posisi tidak dapat ditemukan.',
          3: 'Waktu habis. Coba lagi.',
        };
        setGeoState('error');
        setGeoError(messages[err.code] ?? 'Gagal mendapatkan lokasi.');
      },
      { timeout: 10_000, maximumAge: 5 * 60_000 }
    );
  };

  const handleSave = () => {
    if (!selected) return;
    saveCity(selected.city.toLowerCase());
    saveCountry(selected.countryCode);
    onClose();
  };

  const formProps: LocationFormProps = {
    isMobile,
    query,
    suggestions,
    selected,
    isSearching,
    geoState,
    geoError,
    inputRef,
    onQueryChange: handleQueryChange,
    onSelect: handleSelect,
    onClear: handleClear,
    onUseGeolocation: handleUseGeolocation,
  };

  const saveButton = (
    <Button onClick={handleSave} disabled={!selected} className="w-full">
      Simpan
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader className="pb-0">
            <DrawerTitle className="text-left">Ubah Lokasi</DrawerTitle>
          </DrawerHeader>
          <LocationForm {...formProps} />
          <DrawerFooter className="pt-0">{saveButton}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ubah Lokasi</DialogTitle>
        </DialogHeader>
        <LocationForm {...formProps} />
        <DialogFooter>{saveButton}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
