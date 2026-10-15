const countryNames = new Intl.DisplayNames(['id-ID'], { type: 'region' });

export function formatCityName(city: string) {
  const name = city.trim().replace(/\s+/g, ' ');
  // Older cookies stored lowercase names; keep the casing of newer API names.
  return name === name.toLocaleLowerCase('id-ID')
    ? name.replace(/(^|[\s-])\p{L}/gu, letter =>
        letter.toLocaleUpperCase('id-ID')
      )
    : name;
}

export function formatCountryName(country: string) {
  const code = country.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code)
    ? (countryNames.of(code) ?? country.trim())
    : country.trim();
}

export function formatLocationLabel(city: string, country: string) {
  return `${formatCityName(city)}, ${formatCountryName(country)}`;
}

export function formatLocationTime(
  now: Date,
  timeZone?: string,
  locale = 'id-ID'
) {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(now);
}

export function getDifferentLocationTime(
  now: Date | null,
  timeZone?: string,
  deviceTimeZone?: string
) {
  if (!now || !timeZone) return null;
  const localTime = formatLocationTime(now, timeZone, 'en-GB');
  const deviceTime = formatLocationTime(now, deviceTimeZone, 'en-GB');
  // Different IANA zones can still show the same time, including during DST.
  return localTime === deviceTime ? null : localTime;
}
