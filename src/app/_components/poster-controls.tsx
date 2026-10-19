import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

import {
  BACKGROUNDS,
  MIN_FONT_SIZE,
  type PosterOptions,
} from './poster-options';

type PosterBackgroundsProps = Readonly<{
  options: PosterOptions;
  onChange: (change: Partial<PosterOptions>) => void;
}>;

type PosterControlsProps = Readonly<
  PosterBackgroundsProps & { maxFontSize: number }
>;

export function PosterControls({
  options,
  maxFontSize,
  onChange,
}: PosterControlsProps) {
  const toggles = [
    ['showTitle', 'Judul'],
    ['showArabic', 'Teks Arab'],
    ['showTranslation', 'Terjemahan'],
    ['textOutline', 'Garis tepi teks'],
  ] as const;
  return (
    <FieldGroup className="gap-4">
      {toggles.map(([key, label]) => (
        <Field key={key} orientation="horizontal" className="gap-4">
          <FieldLabel htmlFor={`poster-${key}`}>{label}</FieldLabel>
          <Switch
            id={`poster-${key}`}
            checked={options[key]}
            onCheckedChange={value => onChange({ [key]: value })}
          />
        </Field>
      ))}
      <Field className="gap-2">
        <FieldLabel htmlFor="poster-font">
          Ukuran teks · {options.fontSize} px
        </FieldLabel>
        <Slider
          id="poster-font"
          aria-label="Ukuran teks poster"
          aria-valuetext={`${options.fontSize} piksel`}
          aria-describedby="poster-font-hint"
          value={[options.fontSize]}
          min={Math.min(MIN_FONT_SIZE, maxFontSize)}
          max={maxFontSize}
          step={1}
          onValueChange={([fontSize]) => onChange({ fontSize })}
        />
        <FieldDescription id="poster-font-hint" className="text-xs">
          Acuan teks Arab pada hasil poster. Maks. {maxFontSize} px agar isi
          tetap muat.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="poster-opacity">
          Latar teks · {options.opacity}%
        </FieldLabel>
        <Slider
          id="poster-opacity"
          aria-label="Kegelapan latar teks"
          value={[options.opacity]}
          min={0}
          max={100}
          step={1}
          onValueChange={([opacity]) => onChange({ opacity })}
        />
      </Field>
    </FieldGroup>
  );
}

export function PosterBackgrounds({
  options,
  onChange,
}: PosterBackgroundsProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  return (
    <Carousel
      aria-label="Pilihan latar poster"
      className="w-full min-w-0 shrink-0"
      setApi={setCarouselApi}
      opts={{ align: 'center', dragFree: true }}
    >
      <CarouselContent className="-ms-2 p-1">
        {BACKGROUNDS.map((bg, index) => (
          <CarouselItem
            key={bg}
            aria-label={`Latar ${index + 1} dari ${BACKGROUNDS.length}`}
            className="basis-auto ps-2"
          >
            <Button
              variant="ghost"
              aria-label={`Pilih latar belakang ${index + 1}`}
              aria-pressed={index === options.bgIndex}
              onClick={() => {
                onChange({ bgIndex: index });
                carouselApi?.scrollTo(index);
              }}
              className={cn(
                'relative h-20 w-12 shrink-0 overflow-hidden rounded-lg border-2 p-0',
                index === options.bgIndex
                  ? 'border-primary'
                  : 'border-transparent opacity-60'
              )}
            >
              <Image
                src={bg}
                alt=""
                fill
                unoptimized
                sizes="48px"
                className="object-cover"
              />
            </Button>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
