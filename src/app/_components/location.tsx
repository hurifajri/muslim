'use client';

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
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from '@/components/ui/combobox';
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
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { InputGroupAddon, InputGroupButton } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { useLocationSearch } from '@/hooks/use-location-search';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  formatCityName,
  formatCountryName,
  formatLocationLabel,
} from '@/lib/location-display';
import { cn } from '@/lib/utils';
import { useLocationStore } from '@/providers/location-store-provider';
import type { LocationSuggestion } from '@/schemas/nominatim';
import { fetchReverseGeocode } from '@/services/nominatim';

import { LocationTime } from './location-time';

// ─── Types ────────────────────────────────────────────────────────────────────

type GeoState = 'idle' | 'loading' | 'error';

type SelectedLocation = LocationSuggestion & {
  source: 'saved' | 'search' | 'geolocation';
};

export type LocationProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
}>;

// ─── Shared Form Body ─────────────────────────────────────────────────────────

function LocationAttribution() {
  return (
    <p className="text-muted-foreground text-xs">
      Data lokasi ©{' '}
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4"
      >
        OpenStreetMap contributors
      </a>
    </p>
  );
}

type LocationFormProps = Readonly<{
  isMobile?: boolean;
  resultsOpen: boolean;
  onResultsOpenChange: (open: boolean) => void;
  popupContainer: React.RefObject<HTMLDivElement | null>;
  query: string;
  suggestions: LocationSuggestion[];
  selected: SelectedLocation | null;
  selectedTimeZone?: string;
  isSearching: boolean;
  searchError: boolean;
  searchErrorMessage: string;
  isEmpty: boolean;
  onRetry: () => void;
  onSearch: () => void;
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
  resultsOpen,
  onResultsOpenChange,
  popupContainer,
  query,
  suggestions,
  selected,
  selectedTimeZone,
  isSearching,
  searchError,
  searchErrorMessage,
  isEmpty,
  onRetry,
  onSearch,
  geoState,
  geoError,
  inputRef,
  onQueryChange,
  onSelect,
  onClear,
  onUseGeolocation,
}: LocationFormProps) {
  const anchor = useComboboxAnchor();
  const showResults =
    resultsOpen && !selected && !searchError && suggestions.length > 0;
  const submitSearch = () => {
    onResultsOpenChange(true);
    inputRef.current?.focus();
    onSearch();
  };

  return (
    <div className={cn('flex flex-col gap-3', isMobile ? 'p-4' : '-m-1 p-1')}>
      <form
        onSubmit={event => {
          event.preventDefault();
          submitSearch();
        }}
      >
        <FieldGroup className="gap-1.5">
          <Field className="gap-1.5" data-invalid={searchError}>
            <FieldLabel id="city-search-label" htmlFor="city-search">
              Lokasi
            </FieldLabel>
            <Combobox<LocationSuggestion>
              items={selected ? [selected] : suggestions}
              value={selected}
              inputValue={query}
              filter={null}
              open={showResults}
              onOpenChange={onResultsOpenChange}
              itemToStringLabel={item => item.displayName}
              isItemEqualToValue={(item, value) =>
                item.placeId === value.placeId
              }
              onInputValueChange={(value, details) => {
                if (details.reason !== 'input-change') return;
                onResultsOpenChange(false);
                onQueryChange(value);
              }}
              onValueChange={value => {
                if (!value) return;
                onResultsOpenChange(false);
                onSelect(value);
                inputRef.current?.focus();
              }}
            >
              <div ref={anchor}>
                <ComboboxInput
                  id="city-search"
                  ref={inputRef}
                  showTrigger={false}
                  placeholder="Cari kota…"
                  autoComplete="off"
                  maxLength={120}
                  aria-labelledby="city-search-label"
                  aria-describedby={
                    searchError
                      ? 'city-search-hint city-search-error'
                      : 'city-search-hint'
                  }
                  aria-invalid={searchError}
                >
                  <InputGroupAddon align="inline-start" asChild>
                    <Label htmlFor="city-search" aria-hidden>
                      {isSearching ? (
                        <LoaderIcon aria-hidden className="animate-spin" />
                      ) : (
                        <SearchIcon aria-hidden />
                      )}
                    </Label>
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    {query && (
                      <InputGroupButton
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => {
                          onResultsOpenChange(false);
                          onClear();
                        }}
                        aria-label="Hapus pencarian"
                      >
                        <XIcon aria-hidden />
                      </InputGroupButton>
                    )}
                    <InputGroupButton
                      type="submit"
                      size="sm"
                      disabled={
                        Boolean(selected) ||
                        query.trim().length < 2 ||
                        isSearching
                      }
                    >
                      Cari
                    </InputGroupButton>
                  </InputGroupAddon>
                </ComboboxInput>
              </div>
              <ComboboxContent
                id="city-search-results"
                container={popupContainer}
                anchor={anchor}
                className="flex max-h-[min(16rem,var(--available-height))] min-w-0 flex-col"
              >
                <ComboboxList
                  aria-label="Hasil pencarian lokasi"
                  className="max-h-48 min-h-0 flex-1"
                >
                  {(suggestion: LocationSuggestion) => (
                    <ComboboxItem key={suggestion.placeId} value={suggestion}>
                      {suggestion.displayName}
                    </ComboboxItem>
                  )}
                </ComboboxList>
                <div className="shrink-0 px-3 pt-1 pb-2">
                  <LocationAttribution />
                </div>
              </ComboboxContent>
            </Combobox>
            {showResults && (
              <output className="sr-only">
                {suggestions.length} lokasi ditemukan. Gunakan panah untuk
                memilih, lalu tekan Enter.
              </output>
            )}
            <FieldDescription id="city-search-hint" className="text-xs">
              Ketik nama kota, lalu tekan Cari atau Enter.
            </FieldDescription>
            {searchError && (
              <div className="flex flex-col items-start gap-1.5">
                <FieldError id="city-search-error">
                  {searchErrorMessage}
                </FieldError>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onResultsOpenChange(true);
                    inputRef.current?.focus();
                    onRetry();
                  }}
                >
                  Coba lagi
                </Button>
              </div>
            )}
          </Field>
          {isEmpty && (
            <output className="text-sm">
              Kota tidak ditemukan. Coba nama lain.
            </output>
          )}
          {selected && (
            <div className="flex flex-col gap-1">
              <p className="flex items-center gap-1 text-xs">
                <CheckIcon aria-hidden className="size-3 shrink-0" />
                <span className="font-medium">{selected.displayName}</span>
              </p>
              <LocationTime
                key={`${selected.city}:${selected.countryCode}`}
                city={selected.city}
                country={selected.countryCode}
                timeZone={selectedTimeZone}
              />
              {selected.source === 'geolocation' && <LocationAttribution />}
            </div>
          )}
        </FieldGroup>
      </form>
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          onResultsOpenChange(false);
          onUseGeolocation();
        }}
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
      {geoState === 'error' && (
        <p className="text-destructive text-xs">{geoError}</p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Location({ isOpen, onClose }: LocationProps) {
  const {
    city: savedCity,
    country: savedCountry,
    timeZone: savedTimeZone,
    setLocation,
  } = useLocationStore(state => state);
  const { isMobile } = useIsMobile();
  const [query, setQuery] = useState(() =>
    formatLocationLabel(savedCity, savedCountry)
  );
  const [selected, setSelected] = useState<SelectedLocation | null>({
    source: 'saved',
    placeId: 0,
    displayName: formatLocationLabel(savedCity, savedCountry),
    city: formatCityName(savedCity),
    country: formatCountryName(savedCountry),
    countryCode: savedCountry.toUpperCase(),
  });
  const [resultsOpen, setResultsOpen] = useState(false);
  const popupContainer = useRef<HTMLDivElement>(null);
  const [geoState, setGeoState] = useState<GeoState>('idle');
  const [geoError, setGeoError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const geoVersion = useRef(0);
  const geoController = useRef<AbortController | null>(null);
  const search = useLocationSearch(query, isOpen && !selected);
  const { suggestions, isSearching } = search;

  useEffect(
    () => () => {
      geoVersion.current++;
      geoController.current?.abort();
    },
    []
  );
  const cancelGeolocation = () => {
    geoVersion.current++;
    geoController.current?.abort();
    setGeoState('idle');
  };
  const handleQueryChange = (value: string) => {
    cancelGeolocation();
    search.reset();
    setQuery(value);
    setSelected(null);
  };
  const handleSelect = (
    suggestion: LocationSuggestion,
    source: 'search' | 'geolocation' = 'search'
  ) => {
    cancelGeolocation();
    search.reset();
    setSelected({ ...suggestion, source });
    setQuery(suggestion.displayName);
  };
  const handleClear = () => {
    handleQueryChange('');
    inputRef.current?.focus();
  };
  const handleClose = () => {
    cancelGeolocation();
    onClose();
  };
  const handleUseGeolocation = () => {
    cancelGeolocation();
    search.reset();
    if (!navigator.geolocation) {
      setGeoState('error');
      setGeoError('Browser tidak mendukung geolokasi.');
      return;
    }
    const version = geoVersion.current;
    setGeoState('loading');
    navigator.geolocation.getCurrentPosition(
      async position => {
        if (version !== geoVersion.current) return;
        const controller = new AbortController();
        geoController.current = controller;
        try {
          const result = await fetchReverseGeocode(
            position.coords.latitude,
            position.coords.longitude,
            controller.signal
          );
          if (version !== geoVersion.current) return;
          if (!result) throw new Error('Kota tidak ditemukan.');
          handleSelect(result, 'geolocation');
        } catch {
          if (version !== geoVersion.current) return;
          setGeoState('error');
          setGeoError('Gagal mendapatkan nama kota dari koordinat. Coba lagi.');
        }
      },
      error => {
        if (version !== geoVersion.current) return;
        const messages: Record<number, string> = {
          1: 'Izin lokasi ditolak. Aktifkan di pengaturan browser.',
          2: 'Posisi tidak dapat ditemukan.',
          3: 'Waktu habis. Coba lagi.',
        };
        setGeoState('error');
        setGeoError(messages[error.code] ?? 'Gagal mendapatkan lokasi.');
      },
      { timeout: 10_000, maximumAge: 5 * 60_000 }
    );
  };

  const handleEscapeKeyDown = (event: KeyboardEvent) => {
    // Radix handles Escape before Base UI; dismiss the results before the modal.
    if (resultsOpen && suggestions.length > 0 && !selected && !search.isError) {
      event.preventDefault();
      setResultsOpen(false);
      inputRef.current?.focus();
    }
  };

  const handleSave = () => {
    if (!selected) return;
    setLocation({
      city: selected.city,
      country: selected.countryCode,
    });
    handleClose();
  };

  const formProps: LocationFormProps = {
    isMobile,
    resultsOpen,
    onResultsOpenChange: setResultsOpen,
    popupContainer,
    query,
    suggestions,
    searchError: search.isError,
    searchErrorMessage: search.errorMessage,
    isEmpty: search.isEmpty,
    onRetry: search.retry,
    onSearch: () => {
      cancelGeolocation();
      search.submit();
    },
    selected,
    selectedTimeZone:
      selected?.city.toLowerCase() === savedCity.toLowerCase() &&
      selected?.countryCode === savedCountry.toUpperCase()
        ? savedTimeZone
        : undefined,
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
      <Drawer
        open={isOpen}
        onOpenChange={open => {
          if (!open) handleClose();
        }}
      >
        <DrawerContent
          ref={popupContainer}
          id="location-dialog"
          onEscapeKeyDown={handleEscapeKeyDown}
        >
          <DrawerHeader className="shrink-0 pb-0">
            <DrawerTitle className="text-left">Ubah lokasi</DrawerTitle>
          </DrawerHeader>
          <LocationForm {...formProps} />
          <DrawerFooter className="shrink-0 pt-0">{saveButton}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        ref={popupContainer}
        onEscapeKeyDown={handleEscapeKeyDown}
        id="location-dialog"
      >
        <DialogHeader>
          <DialogTitle>Ubah lokasi</DialogTitle>
        </DialogHeader>
        <LocationForm {...formProps} />
        <DialogFooter>{saveButton}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
