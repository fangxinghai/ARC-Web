import { useEffect, useMemo, useState } from "react";
import {
  GetBehaviorDetailsResponse,
  BehaviorBindingParametersSet,
} from "@zmkfirmware/zmk-studio-ts-client/behaviors";
import { BehaviorBinding } from "@zmkfirmware/zmk-studio-ts-client/keymap";
import { BehaviorParametersPicker } from "./BehaviorParametersPicker";
import { validateValue } from "./parameters";

export interface BehaviorBindingPickerProps {
  binding: BehaviorBinding;
  behaviors: GetBehaviorDetailsResponse[];
  layers: { id: number; name: string }[];
  onBindingChanged: (binding: BehaviorBinding) => void;
}

function validateBinding(
  metadata: BehaviorBindingParametersSet[],
  layerIds: number[],
  param1?: number,
  param2?: number
): boolean {
  if (
    (param1 === undefined || param1 === 0) &&
    metadata.every((s) => !s.param1 || s.param1.length === 0)
  ) {
    return true;
  }

  let matchingSet = metadata.find((s) =>
    validateValue(layerIds, param1, s.param1)
  );

  if (!matchingSet) {
    return false;
  }

  return validateValue(layerIds, param2, matchingSet.param2);
}

interface QuickKey {
  label: string;
  sub?: string;
  page: number;
  id: number;
}

function makeUsage(page: number, id: number): number {
  return (page << 16) | id;
}

const ALPHA_KEYS: QuickKey[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  .split("")
  .map((c, i) => ({ label: c, page: 7, id: 4 + i }));

const NUMBER_KEYS: QuickKey[] = [
  { label: "1", page: 7, id: 0x1e },
  { label: "2", page: 7, id: 0x1f },
  { label: "3", page: 7, id: 0x20 },
  { label: "4", page: 7, id: 0x21 },
  { label: "5", page: 7, id: 0x22 },
  { label: "6", page: 7, id: 0x23 },
  { label: "7", page: 7, id: 0x24 },
  { label: "8", page: 7, id: 0x25 },
  { label: "9", page: 7, id: 0x26 },
  { label: "0", page: 7, id: 0x27 },
];

const F_KEYS: QuickKey[] = Array.from({ length: 12 }, (_, i) => ({
  label: `F${i + 1}`,
  page: 7,
  id: 0x3a + i,
}));

const SPECIAL_KEYS: QuickKey[] = [
  { label: "Esc", page: 7, id: 0x29 },
  { label: "Tab", page: 7, id: 0x2b },
  { label: "Space", sub: "\u7A7A\u683C", page: 7, id: 0x2c },
  { label: "Enter", sub: "\u56DE\u8F66", page: 7, id: 0x28 },
  { label: "Bksp", sub: "\u9000\u683C", page: 7, id: 0x2a },
  { label: "Del", sub: "\u5220\u9664", page: 7, id: 0x4c },
  { label: "Ins", page: 7, id: 0x49 },
  { label: "Home", page: 7, id: 0x4a },
  { label: "End", page: 7, id: 0x4d },
  { label: "PgUp", page: 7, id: 0x4b },
  { label: "PgDn", page: 7, id: 0x4e },
  { label: "\u2191", sub: "Up", page: 7, id: 0x52 },
  { label: "\u2193", sub: "Down", page: 7, id: 0x51 },
  { label: "\u2190", sub: "Left", page: 7, id: 0x50 },
  { label: "\u2192", sub: "Right", page: 7, id: 0x4f },
  { label: "PrtSc", page: 7, id: 0x46 },
  { label: "Caps", page: 7, id: 0x39 },
  { label: "NumLk", page: 7, id: 0x53 },
];

const MOD_KEYS: QuickKey[] = [
  { label: "L Ctrl", page: 7, id: 0xe0 },
  { label: "L Shift", page: 7, id: 0xe1 },
  { label: "L Alt", page: 7, id: 0xe2 },
  { label: "L GUI", sub: "Win/Cmd", page: 7, id: 0xe3 },
  { label: "R Ctrl", page: 7, id: 0xe4 },
  { label: "R Shift", page: 7, id: 0xe5 },
  { label: "R Alt", page: 7, id: 0xe6 },
  { label: "R GUI", sub: "Win/Cmd", page: 7, id: 0xe7 },
];

const SYMBOL_KEYS: QuickKey[] = [
  { label: "-", page: 7, id: 0x2d },
  { label: "=", page: 7, id: 0x2e },
  { label: "[", page: 7, id: 0x2f },
  { label: "]", page: 7, id: 0x30 },
  { label: "\\", page: 7, id: 0x31 },
  { label: ";", page: 7, id: 0x33 },
  { label: "'", page: 7, id: 0x34 },
  { label: "`", page: 7, id: 0x35 },
  { label: ",", page: 7, id: 0x36 },
  { label: ".", page: 7, id: 0x37 },
  { label: "/", page: 7, id: 0x38 },
];

const MEDIA_KEYS: QuickKey[] = [
  { label: "\uD83D\uDD0A+", sub: "\u97F3\u91CF+", page: 12, id: 0xe9 },
  { label: "\uD83D\uDD0A-", sub: "\u97F3\u91CF-", page: 12, id: 0xea },
  { label: "\uD83D\uDD07", sub: "\u9759\u97F3", page: 12, id: 0xe2 },
  { label: "\u23ED", sub: "\u4E0B\u4E00\u66F2", page: 12, id: 0xb5 },
  { label: "\u23EE", sub: "\u4E0A\u4E00\u66F2", page: 12, id: 0xb6 },
  { label: "\u23EF", sub: "\u64AD\u653E/\u6682\u505C", page: 12, id: 0xcd },
  { label: "\u2600+", sub: "\u4EAE\u5EA6+", page: 12, id: 0x6f },
  { label: "\u2600-", sub: "\u4EAE\u5EA6-", page: 12, id: 0x70 },
];

type CategoryId =
  | "alpha"
  | "number"
  | "fkeys"
  | "special"
  | "mod"
  | "symbol"
  | "media"
  | "advanced";

interface Category {
  id: CategoryId;
  label: string;
  keys?: QuickKey[];
}

const CATEGORIES: Category[] = [
  { id: "alpha", label: "\u5B57\u6BCD", keys: ALPHA_KEYS },
  { id: "number", label: "\u6570\u5B57", keys: NUMBER_KEYS },
  { id: "fkeys", label: "F\u952E", keys: F_KEYS },
  { id: "special", label: "\u7279\u6B8A\u952E", keys: SPECIAL_KEYS },
  { id: "mod", label: "\u4FEE\u9970\u952E", keys: MOD_KEYS },
  { id: "symbol", label: "\u7B26\u53F7", keys: SYMBOL_KEYS },
  { id: "media", label: "\u591A\u5A92\u4F53", keys: MEDIA_KEYS },
  { id: "advanced", label: "\u9AD8\u7EA7\u8BBE\u7F6E" },
];

export const BehaviorBindingPicker = ({
  binding,
  layers,
  behaviors,
  onBindingChanged,
}: BehaviorBindingPickerProps) => {
  const [behaviorId, setBehaviorId] = useState(binding.behaviorId);
  const [param1, setParam1] = useState<number | undefined>(binding.param1);
  const [param2, setParam2] = useState<number | undefined>(binding.param2);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("alpha");

  const metadata = useMemo(
    () => behaviors.find((b) => b.id == behaviorId)?.metadata,
    [behaviorId, behaviors]
  );

  const sortedBehaviors = useMemo(
    () =>
      [...behaviors].sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
      ),
    [behaviors]
  );

  // Find "key press" behavior
  const keyPressBehavior = useMemo(() => {
    return behaviors.find(
      (b) =>
        b.displayName.toLowerCase().includes("key") &&
        b.displayName.toLowerCase().includes("press")
    );
  }, [behaviors]);

  useEffect(() => {
    if (
      binding.behaviorId === behaviorId &&
      binding.param1 === param1 &&
      binding.param2 === param2
    ) {
      return;
    }

    if (!metadata) {
      console.error(
        "Can't find metadata for the selected behaviorId",
        behaviorId
      );
      return;
    }

    if (
      validateBinding(
        metadata,
        layers.map(({ id }) => id),
        param1,
        param2
      )
    ) {
      onBindingChanged({
        behaviorId,
        param1: param1 || 0,
        param2: param2 || 0,
      });
    }
  }, [behaviorId, param1, param2]);

  useEffect(() => {
    setBehaviorId(binding.behaviorId);
    setParam1(binding.param1);
    setParam2(binding.param2);
  }, [binding]);

  const handleQuickKey = (key: QuickKey) => {
    if (!keyPressBehavior) return;
    const usage = makeUsage(key.page, key.id);
    setBehaviorId(keyPressBehavior.id);
    setParam1(usage);
    setParam2(0);
  };

  const currentUsage = useMemo(() => {
    if (!keyPressBehavior || behaviorId !== keyPressBehavior.id) return -1;
    return param1 || 0;
  }, [behaviorId, param1, keyPressBehavior]);

  const activeCat = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto p-1">
      {/* Category tabs */}
      <div className="flex gap-1 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2.5 py-1 text-[11px] rounded-md transition-all border ${
              activeCategory === cat.id
                ? "bg-primary text-primary-content border-primary font-semibold"
                : "bg-base-100 hover:bg-base-300 text-base-content/70 border-base-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Visual keyboard grid */}
      {activeCategory !== "advanced" && activeCat?.keys && (
        <div
          className={`grid gap-1 ${
            activeCategory === "alpha"
              ? "grid-cols-[repeat(auto-fill,minmax(36px,1fr))]"
              : activeCategory === "media"
              ? "grid-cols-[repeat(auto-fill,minmax(64px,1fr))]"
              : "grid-cols-[repeat(auto-fill,minmax(48px,1fr))]"
          }`}
        >
          {activeCat.keys.map((key) => {
            const usage = makeUsage(key.page, key.id);
            const isActive = currentUsage === usage;
            return (
              <button
                key={usage}
                onClick={() => handleQuickKey(key)}
                title={key.sub || key.label}
                className={`flex flex-col items-center justify-center rounded-md text-xs transition-all duration-100 border ${
                  key.sub
                    ? "min-h-[40px] py-1"
                    : "min-h-[36px]"
                } ${
                  isActive
                    ? "bg-primary text-primary-content border-primary font-bold shadow-sm scale-105"
                    : "bg-base-100 hover:bg-base-200 text-base-content border-base-300 hover:border-primary/50 hover:-translate-y-px hover:shadow-sm active:scale-95"
                }`}
              >
                <span className="leading-none font-medium">{key.label}</span>
                {key.sub && (
                  <span
                    className={`text-[9px] leading-none mt-0.5 ${
                      isActive ? "text-primary-content/70" : "text-base-content/40"
                    }`}
                  >
                    {key.sub}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Advanced mode */}
      {activeCategory === "advanced" && (
        <div className="flex flex-col gap-2">
          <div>
            <label className="text-[11px] text-base-content/50 block mb-1">
              \u884C\u4E3A\u7C7B\u578B
            </label>
            <select
              value={behaviorId}
              className="h-8 rounded-md w-full text-sm bg-base-100 border border-base-300"
              onChange={(e) => {
                setBehaviorId(parseInt(e.target.value));
                setParam1(0);
                setParam2(0);
              }}
            >
              {sortedBehaviors.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.displayName}
                </option>
              ))}
            </select>
          </div>
          {metadata && (
            <BehaviorParametersPicker
              metadata={metadata}
              param1={param1}
              param2={param2}
              layers={layers}
              onParam1Changed={setParam1}
              onParam2Changed={setParam2}
            />
          )}
        </div>
      )}
    </div>
  );
};
