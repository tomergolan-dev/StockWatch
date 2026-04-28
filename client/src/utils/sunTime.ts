export function getFallbackIsDark(): boolean {
    const hour = new Date().getHours();
    return hour < 6 || hour >= 19;
}

function calculateSunTime(
    latitude: number,
    longitude: number,
    isSunrise: boolean
): number | null {
    const date = new Date();
    const dayStart = new Date(date.getFullYear(), 0, 0);
    const dayOfYear = Math.floor(
        (date.getTime() - dayStart.getTime()) / 1000 / 60 / 60 / 24
    );

    const lngHour = longitude / 15;
    const t = isSunrise
        ? dayOfYear + (6 - lngHour) / 24
        : dayOfYear + (18 - lngHour) / 24;

    const M = 0.9856 * t - 3.289;

    let L =
        M +
        1.916 * Math.sin((Math.PI / 180) * M) +
        0.02 * Math.sin((Math.PI / 180) * 2 * M) +
        282.634;

    L = (L + 360) % 360;

    let RA =
        (180 / Math.PI) *
        Math.atan(0.91764 * Math.tan((Math.PI / 180) * L));

    RA = (RA + 360) % 360;

    const Lquadrant = Math.floor(L / 90) * 90;
    const RAquadrant = Math.floor(RA / 90) * 90;

    RA += Lquadrant - RAquadrant;
    RA /= 15;

    const sinDec = 0.39782 * Math.sin((Math.PI / 180) * L);
    const cosDec = Math.cos(Math.asin(sinDec));

    const zenith = 90.833;

    const cosH =
        (Math.cos((Math.PI / 180) * zenith) -
            sinDec * Math.sin((Math.PI / 180) * latitude)) /
        (cosDec * Math.cos((Math.PI / 180) * latitude));

    if (cosH > 1 || cosH < -1) return null;

    const H = isSunrise
        ? 360 - (180 / Math.PI) * Math.acos(cosH)
        : (180 / Math.PI) * Math.acos(cosH);

    const Hhours = H / 15;

    const T = Hhours + RA - 0.06571 * t - 6.622;

    const UT = (T - lngHour + 24) % 24;
    const offset = -date.getTimezoneOffset() / 60;

    return (UT + offset + 24) % 24;
}

export function shouldUseDarkBySun(
    latitude: number,
    longitude: number
): boolean {
    const sunrise = calculateSunTime(latitude, longitude, true);
    const sunset = calculateSunTime(latitude, longitude, false);

    if (sunrise === null || sunset === null) {
        return getFallbackIsDark();
    }

    const now = new Date();
    const time = now.getHours() + now.getMinutes() / 60;

    return time < sunrise || time >= sunset;
}