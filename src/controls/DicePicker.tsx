import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";

import { DicePreview } from "../previews/DicePreview";

import { useDiceControlsStore } from "./store";
import { useDiceRollStore } from "../dice/store";

export function DicePicker() {
  const counts = useDiceControlsStore((state) => state.diceCounts);
  const diceById = useDiceControlsStore((state) => state.diceById);
  const addRedD6 = useDiceControlsStore((state) => state.incrementDieCount);
  const handleDiceCountIncrease = useDiceControlsStore(
    (state) => state.incrementDieCount
  );
  const clearRoll = useDiceRollStore((state) => state.clearRoll);
  const roll = useDiceRollStore((state) => state.roll);
  function clearRollIfNeeded() {
    if (roll) {
      clearRoll();
    }
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
        <Badge
          badgeContent={counts["red_d6"] ?? 0}
          sx={{
            ".MuiBadge-badge": {
              bgcolor: "background.default",
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.30))",
              pointerEvents: "none",
            },
          }}
          overlap="circular"
        >
          <IconButton
            onClick={() => {
              addRedD6("red_d6");
              clearRollIfNeeded();
            }}
            sx={{
              p: 0,
              border: "1px solid rgba(255, 80, 80, 0.9)",
              backgroundColor: "rgba(255, 80, 80, 0.12)",
              boxShadow: "0 0 0 1px rgba(255, 80, 80, 0.2), 0 8px 16px rgba(255, 0, 0, 0.08)",
              borderRadius: 2,
              transition: "transform 120ms ease, box-shadow 120ms ease",
              '&:hover': {
                transform: "scale(1.04)",
                boxShadow: "0 0 0 1px rgba(255, 80, 80, 1), 0 10px 22px rgba(255, 0, 0, 0.16)",
                backgroundColor: "rgba(255, 80, 80, 0.18)",
              },
            }}
          >
            <DicePreview diceStyle="RED" diceType="D6" />
          </IconButton>
        </Badge>
      </div>
      {Object.entries(counts).map(([id, count]) => {
        if (id === "red_d6") {
          return null;
        }
        const die = diceById[id];
        if (!die) {
          return null;
        }
        return (
          <Badge
            badgeContent={count}
            sx={{
              ".MuiBadge-badge": {
                bgcolor: "background.default",
                backgroundImage:
                  "linear-gradient(rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.30))",
                pointerEvents: "none",
              },
            }}
            overlap="circular"
            key={id}
          >
            <IconButton
              onClick={() => {
                handleDiceCountIncrease(id);
                clearRollIfNeeded();
              }}
              sx={{ p: 0 }}
            >
              <DicePreview diceStyle={die.style} diceType={die.type} />
            </IconButton>
          </Badge>
        );
      })}
    </>
  );
}
