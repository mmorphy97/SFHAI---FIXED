'use client';

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Heart, Wallet, MapPin, SlidersHorizontal, House, Building2, Bed, Bath } from "lucide-react";

// Mock listings for South Florida (buy + rent)
const MOCK_LISTINGS = [
  { id: "1", price: 750000, beds: 4, baths: 3, sqft: 2520, city: "Hollywood", county: "Broward", type: "Single Family", img: "https://picsum.photos/seed/hollywood-fl-1/640/360" },
  { id: "2", price: 625000, beds: 3, baths: 2, sqft: 1880, city: "Boca Raton", county: "Palm Beach", type: "Townhome", img: "https://picsum.photos/seed/bocaraton-fl-1/640/360" },
  { id: "3", price: 520000, beds: 2, baths: 2, sqft: 1420, city: "Fort Lauderdale", county: "Broward", type: "Condo", img: "https://picsum.photos/seed/fortlauderdale-fl-1/640/360" },
  { id: "4", price: 3095, beds: 2, baths: 2, sqft: 1100, city: "Brickell", county: "Miami-Dade", type: "Apartment", rent: true, img: "https://picsum.photos/seed/brickell-miami-1/640/360" },
  { id: "5", price: 989000, beds: 5, baths: 4, sqft: 3200, city: "West Palm Beach", county: "Palm Beach", type: "Single Family", img: "https://picsum.photos/seed/wpb-fl-1/640/360" },
  { id: "6", price: 415000, beds: 2, baths: 2, sqft: 1200, city: "Coral Gables", county: "Miami-Dade", type: "Condo", img: "https://picsum.photos/seed/coralgables-fl-1/640/360" },
  { id: "7", price: 785000, beds: 3, baths: 3, sqft: 2100, city: "Coconut Grove", county: "Miami-Dade", type: "Townhome", img: "https://picsum.photos/seed/coconutgrove-fl-1/640/360" },
  { id: "8", price: 2450, beds: 1, baths: 1, sqft: 780, city: "Wynwood", county: "Miami-Dade", type: "Loft", rent: true, img: "https://picsum.photos/seed/wynwood-miami-1/640/360" },
  { id: "9", price: 439000, beds: 2, baths: 2, sqft: 1280, city: "Aventura", county: "Miami-Dade", type: "Condo", img: "https://picsum.photos/seed/aventura-fl-1/640/360" },
  { id: "10", price: 1195000, beds: 4, baths: 4, sqft: 2850, city: "Sunny Isles Beach", county: "Miami-Dade", type: "Penthouse Condo", img: "https://picsum.photos/seed/sunnyisles-fl-1/640/360" },
  { id: "11", price: 3295, beds: 3, baths: 2, sqft: 1500, city: "Pembroke Pines", county: "Broward", type: "Single Family (Rent)", rent: true, img: "https://picsum.photos/seed/pembrokepines-fl-1/640/360" },
  { id: "12", price: 879000, beds: 4, baths: 3, sqft: 2600, city: "Parkland", county: "Broward", type: "Single Family", img: "https://picsum.photos/seed/parkland-fl-1/640/360" },
  { id: "13", price: 569000, beds: 3, baths: 2, sqft: 1750, city: "Davie", county: "Broward", type: "Ranch", img: "https://picsum.photos/seed/davie-fl-1/640/360" },
  { id: "14", price: 2650, beds: 2, baths: 1, sqft: 980, city: "Little Havana", county: "Miami-Dade", type: "Apartment", rent: true, img: "https://picsum.photos/seed/littlehavana-miami-1/640/360" },
  { id: "15", price: 1495000, beds: 5, baths: 5, sqft: 4100, city: "Coral Ridge", county: "Broward", type: "Waterfront", img: "https://picsum.photos/seed/coralridge-fl-1/640/360" },
  { id: "16", price: 359000, beds: 1, baths: 1, sqft: 900, city: "Delray Beach", county: "Palm Beach", type: "Condo", img: "https://picsum.photos/seed/delray-fl-1/640/360" }
];

// Neighborhood quick chips
const NEIGHBORHOOD_CHIPS = [
  "Brickell", "Wynwood", "Boca Raton", "Fort Lauderdale", "Hollywood",
  "Aventura", "Sunny Isles Beach", "West Palm Beach", "Coral Gables", "Delray Beach"
];

const currency = (n?: number) => n?.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function whyThisMatch(listing: any, { beds, maxPrice, city }: { beds: number, maxPrice: number, city: string }) {
  const reasons: string[] = [];
  if (beds && listing.beds >= beds) reasons.push(`${listing.beds}+ beds meets your ${beds}+ beds preference`);
  if (maxPrice && ((listing.price || 0) <= maxPrice)) reasons.push(`Price is within your cap (${new Intl.NumberFormat(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0}).format(maxPrice)} or less)`);
  if (city && listing.city === city) reasons.push(`Located in your selected area (${city})`);
  if (!reasons.length) return "Matches your general preferences and location settings.";
  return reasons.join(" · ");
}

// UI bits
const Pill = ({ active, onClick, children }: any) => (
  <button onClick={onClick} className={`px-3 py-1 rounded-full text-sm border ${active ? "bg-blue-600 text-white border-blue-600" : "bg-white/70 border-zinc-300"}`}>{children}</button>
);

const Card = ({ children, className = "" }: any) => (
  <div className={`rounded-2xl border border-zinc-200 bg-white/80 shadow-sm ${className}`}>{children}</div>
);

function TabBar({ tab, setTab }: any) {
  const items = [
    { key: "discover", label: "Discover", icon: <MapPin className="h-5 w-5"/> },
    { key: "saved", label: "Saved", icon: <Heart className="h-5 w-5"/> },
    { key: "budget", label: "Budget", icon: <Wallet className="h-5 w-5"/> },
  ];
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white/95 backdrop-blur border-t">
      <div className="mx-auto max-w-md grid grid-cols-3">
        {items.map((it) => (
          <button key={it.key} onClick={() => setTab(it.key)} className={`flex items-center justify-center gap-2 py-3 ${tab===it.key?"text-blue-600 font-medium":"text-zinc-600"}`}>
            {it.icon}
            <span className="text-sm">{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Discover
function Discover() {
  const [view, setView] = useState("map");
  const [beds, setBeds] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [city, setCity] = useState("");

  const filtered = useMemo(() => MOCK_LISTINGS.filter(l =>
    (beds ? l.beds >= beds : true) &&
    (maxPrice ? (l.price || 0) <= maxPrice : true) &&
    (city ? l.city === city : true)
  ), [beds, maxPrice, city]);

  return (
    <div className="px-4 pb-24 pt-4 space-y-4 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Discover</h1>
        <SlidersHorizontal className="h-5 w-5"/>
      </div>

      <div className="flex flex-wrap gap-2">
        <Pill active={view==="map"} onClick={()=>setView("map")}>Map</Pill>
        <Pill active={view==="grid"} onClick={()=>setView("grid")}>Grid</Pill>
        <Pill active={beds===2} onClick={()=>setBeds(beds===2?0:2)}><Bed className="inline h-4 w-4 mr-1"/>2+ Beds</Pill>
        <Pill active={maxPrice===600000} onClick={()=>setMaxPrice(maxPrice===600000?1000000:600000)}>≤ {currency(maxPrice)}</Pill>
      </div>

      <div className="flex flex-wrap gap-2">
        {NEIGHBORHOOD_CHIPS.map((n) => (
          <Pill key={n} active={city===n} onClick={()=> setCity(city===n?"":n)}>{n}</Pill>
        ))}
      </div>

      {view === "map" ? (
        <Card className="h-64 grid place-items-center text-zinc-500">
          <div className="text-center">
            <MapPin className="h-6 w-6 mx-auto mb-1"/>
            <p>Map placeholder · South Florida</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((l) => (
            <ListingCard key={l.id} listing={l} why={whyThisMatch(l, {beds, maxPrice, city})} />
          ))}
        </div>
      )}

      <Card className="p-3">
        <p className="text-sm text-zinc-600">Tip: Tap the heart on a listing to save it. Your feedback trains the AI to improve matches.</p>
      </Card>
    </div>
  );
}

function ListingCard({ listing, why }: any) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-zinc-200" style={{backgroundImage:`url(${listing.img})`, backgroundSize:'cover'}} />
      <div className="p-3 space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{listing.rent? currency(listing.price)+"/mo" : currency(listing.price)}</div>
          <button className="p-1 rounded-full border hover:bg-blue-50 text-zinc-600"><Heart className="h-4 w-4"/></button>
        </div>
        <div className="text-sm text-zinc-600 flex items-center gap-3">
          <span className="flex items-center gap-1"><Bed className="h-4 w-4"/>{listing.beds}</span>
          <span className="flex items-center gap-1"><Bath className="h-4 w-4"/>{listing.baths}</span>
          <span>{listing.sqft?.toLocaleString()} sq ft</span>
        </div>
        <div className="text-sm text-zinc-700">{listing.city}, FL · {listing.type}</div>
        {why && (
          <div className="text-xs text-zinc-500 mt-1 border-t pt-2">Why this match: {why}</div>
        )}
      </div>
    </Card>
  );
}

// Saved
function Saved() {
  return (
    <div className="px-4 pb-24 pt-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Saved Properties</h1>
      <Card className="p-3">
        <p className="text-sm text-zinc-600">You haven’t saved anything yet. Explore in Discover and tap <span className="inline-block align-middle"><Heart className="inline h-4 w-4"/></span> to add favorites.</p>
      </Card>
      <div className="grid grid-cols-1 gap-3">
        {MOCK_LISTINGS.slice(0,2).map((l)=> <ListingCard key={l.id} listing={l as any} />)}
      </div>
    </div>
  );
}

// Budget
function Budget() {
  const [mode, setMode] = useState<"buyer"|"renter">("buyer");
  const [price, setPrice] = useState(650000);
  const [downPct, setDownPct] = useState(20);
  const [ratePct, setRatePct] = useState(6.75);
  const [years, setYears] = useState(30);
  const [hoa, setHoa] = useState(350);
  const [income, setIncome] = useState(10000);
  const [ratio, setRatio] = useState(33);

  const buyerMonthly = useMemo(() => Math.round(monthlyMortgage({ price, downPct, ratePct, years, hoa })), [price, downPct, ratePct, years, hoa]);
  const renterMax = useMemo(() => Math.round((income * ratio) / 100), [income, ratio]);

  return (
    <div className="px-4 pb-24 pt-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Budgeting Tool</h1>

      <div className="flex gap-2">
        <Pill active={mode==="buyer"} onClick={()=>setMode("buyer")}><House className="h-4 w-4 mr-1"/>Buyer</Pill>
        <Pill active={mode==="renter"} onClick={()=>setMode("renter")}><Building2 className="h-4 w-4 mr-1"/>Renter</Pill>
      </div>

      {mode === "buyer" ? (
        <div className="space-y-3">
          <Card className="p-3 grid grid-cols-2 gap-3">
            <Field label="Home price" value={price} onChange={setPrice} prefix="$" />
            <Field label="Down payment %" value={downPct} onChange={setDownPct} suffix="%" />
            <Field label="Rate" value={ratePct} onChange={setRatePct} suffix="%" />
            <Field label="Term (years)" value={years} onChange={setYears} />
            <Field label="HOA / mo" value={hoa} onChange={setHoa} prefix="$" />
          </Card>

          <Card className="p-3">
            <div className="text-sm text-zinc-600">Estimated monthly payment</div>
            <div className="text-3xl font-semibold">{currency(buyerMonthly)}/mo</div>
            <div className="text-xs text-zinc-500 mt-1">Includes mortgage, est. taxes & insurance, plus HOA. For guidance only.</div>
          </Card>
        </div>
      ) : (
        <div className="space-y-3">
          <Card className="p-3 grid grid-cols-2 gap-3">
            <Field label="Monthly income" value={income} onChange={setIncome} prefix="$" />
            <Field label="Rent-to-income" value={ratio} onChange={setRatio} suffix="%" />
          </Card>
          <Card className="p-3">
            <div className="text-sm text-zinc-600">Suggested max rent</div>
            <div className="text-3xl font-semibold">{currency(renterMax)}/mo</div>
            <div className="text-xs text-zinc-500 mt-1">Based on your chosen affordability ratio.</div>
          </Card>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, prefix, suffix }: any) {
  return (
    <label className="text-sm">
      <div className="mb-1 text-zinc-600">{label}</div>
      <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-white/70">
        {prefix && <span className="text-zinc-500">{prefix}</span>}
        <input type="number" value={value} onChange={(e)=>onChange(Number(e.target.value))} className="w-full bg-transparent outline-none"/>
        {suffix && <span className="text-zinc-500">{suffix}</span>}
      </div>
    </label>
  );
}

function monthlyMortgage({ price, downPct, ratePct, years, hoa = 0 }: any) {
  const P = Math.max(price * (1 - downPct / 100), 0);
  const r = ratePct / 100 / 12;
  const n = years * 12;
  const mortgage = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const taxPct = 1.1, insPct = 0.7;
  const taxes = (price * (taxPct / 100)) / 12;
  const insurance = (price * (insPct / 100)) / 12;
  return Math.max(0, mortgage + taxes + insurance + hoa);
}

export default function App() {
  const [tab, setTab] = useState("discover");
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-900">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
        <div className="max-w-md mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold"><Home className="h-5 w-5 text-blue-600"/> YourBrand</div>
          <div className="text-xs text-zinc-500">South Florida</div>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {tab === "discover" && <motion.div key="discover" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}><Discover/></motion.div>}
          {tab === "saved" && <motion.div key="saved" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}><Saved/></motion.div>}
          {tab === "budget" && <motion.div key="budget" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}><Budget/></motion.div>}
        </AnimatePresence>
      </main>

      <TabBar tab={tab} setTab={setTab} />
    </div>
  );
}
