import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const apiKey = process.env.RESTCOUNTRIES_API_KEY;

if (!apiKey) {
  throw new Error(
    "La variable RESTCOUNTRIES_API_KEY est absente. Consulte README.md.",
  );
}

const endpoint = new URL("https://api.restcountries.com/countries/v5");
endpoint.searchParams.set("region", "Europe");
endpoint.searchParams.set("limit", "100");
endpoint.searchParams.set(
  "response_fields",
  [
    "names.common",
    "codes.alpha_2",
    "flag.url_svg",
    "languages",
    "capitals",
    "population",
  ].join(","),
);

const response = await fetch(endpoint, {
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(
    `REST Countries a répondu ${response.status}: ${body.slice(0, 300)}`,
  );
}

const payload = await response.json();
const objects = payload?.data?.objects;

if (!Array.isArray(objects) || objects.length < 40) {
  throw new Error(
    `REST Countries a retourné une liste européenne incomplète (${objects?.length ?? 0} pays).`,
  );
}

// Conserve le format v3.1 déjà consommé par les composants React.
const countries = objects
  .map((country) => ({
    cca2: country.codes?.alpha_2 ?? "",
    name: { common: country.names?.common ?? "Unknown" },
    flags: { svg: country.flag?.url_svg ?? "" },
    languages: Object.fromEntries(
      (country.languages ?? []).map((language, index) => [
        language.iso_639_3 ??
          language.iso_639_2 ??
          language.iso_639_1 ??
          String(index),
        language.name ?? language.english_name ?? language.native_name ?? "",
      ]),
    ),
    capital: (country.capitals ?? [])
      .map((capital) =>
        typeof capital === "string" ? capital : capital?.name,
      )
      .filter(Boolean),
    population: country.population ?? 0,
  }))
  .sort((a, b) => a.name.common.localeCompare(b.name.common));

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(scriptDirectory, "../public/data/europe.json");

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(countries, null, 2)}\n`, "utf8");

console.log(`${countries.length} pays enregistrés dans ${outputPath}`);
