import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "scraper", "sites.json");

/**
 * Helperfunction: Read sites.json and return the parsed content
 */
async function readSitesFile() {
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = JSON.parse(raw);

  if (!parsed.urls || !Array.isArray(parsed.urls)) {
    throw new Error("sites.json has no valid 'urls' array");
  }

  return parsed;
}

/**
 * GET -> return all URLs in sites.json
 */
export async function GET() {
  try {
    const data = await readSitesFile();
    return NextResponse.json(data.urls);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST -> add a new URL to sites.json
 * body: { url: "https://..." }
 */
export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "url missing or invalid" },
        { status: 400 }
      );
    }

    const data = await readSitesFile();

    if (data.urls.includes(url)) {
      return NextResponse.json(
        { error: "URL already exists" },
        { status: 409 }
      );
    }

    data.urls.push(url);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE -> delete a URL from sites.json
 * body: { url: "https://..." }
 */
export async function DELETE(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "url missing" },
        { status: 400 }
      );
    }

    const data = await readSitesFile();

    const filtered = data.urls.filter((u) => u !== url);

    if (filtered.length === data.urls.length) {
      return NextResponse.json(
        { error: "URL could not be found" },
        { status: 404 }
      );
    }

    data.urls = filtered;

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}