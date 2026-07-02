import { useMemo } from "react";

import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Grow from "@mui/material/Grow";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { getCombinedDiceValue } from "../helpers/getCombinedDiceValue";
import { DiceRoll } from "../types/DiceRoll";
import { Die, isDie } from "../types/Die";
import { Dice, isDice } from "../types/Dice";
import { DicePreview } from "../previews/DicePreview";

const isStressDie = (die: Die) => die.style === "RED";

function getRollGroups(
  diceRoll: DiceRoll,
  rollValues: Record<string, number>
) {
  const ordinary: Array<{ die: Die; value: number }> = [];
  const stress: Array<{ die: Die; value: number }> = [];

  for (const die of diceRoll.dice.filter(isDie)) {
    const value = rollValues[die.id];
    if (value === undefined) {
      continue;
    }
    if (isStressDie(die)) {
      stress.push({ die, value });
    } else {
      ordinary.push({ die, value });
    }
  }

  return { ordinary, stress };
}

export function DiceResults({
  diceRoll,
  rollValues,
  expanded,
  onExpand,
}: {
  diceRoll: DiceRoll;
  rollValues: Record<string, number>;
  expanded: boolean;
  onExpand: (expand: boolean) => void;
}) {
  const { ordinary, stress } = useMemo(
    () => getRollGroups(diceRoll, rollValues),
    [diceRoll, rollValues]
  );

  return (
    <Stack alignItems="center" maxHeight="calc(100vh - 100px)">
      <Tooltip
        title={expanded ? "Hide Breakdown" : "Show Breakdown"}
        disableInteractive
      >
        <Button
          sx={{
            pointerEvents: "all",
            padding: 0.5,
            minWidth: "40px",
            textTransform: "none",
          }}
          onClick={() => onExpand(!expanded)}
          color="inherit"
        >
          <Stack direction="row" gap={1} alignItems="flex-start">
            <ResultColumn title="Нормальные" dice={ordinary} />
            <ResultColumn title="Стресс" dice={stress} highlight />
          </Stack>
        </Button>
      </Tooltip>
      <Grow
        in={expanded}
        mountOnEnter
        unmountOnExit
        style={{ transformOrigin: "50% 0 0" }}
      >
        <Stack overflow="auto" sx={{ pointerEvents: "all" }}>
          <DiceResultsExpanded diceRoll={diceRoll} rollValues={rollValues} />
        </Stack>
      </Grow>
    </Stack>
  );
}

function ResultColumn({
  title,
  dice,
  highlight,
}: {
  title: string;
  dice: Array<{ die: Die; value: number }>;
  highlight?: boolean;
}) {
  return (
    <Stack
      sx={{
        minWidth: 120,
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 1,
        p: 1,
        gap: 1,
        backgroundColor: highlight ? "rgba(255, 80, 80, 0.14)" : "transparent",
        borderColor: highlight ? "rgba(255, 80, 80, 0.45)" : "rgba(255,255,255,0.2)",
      }}
    >
      <Typography color={highlight ? "#FF8A80" : "white"} variant="subtitle2" fontWeight={600}>
        {title}
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={0.5}>
        {dice.length === 0 ? (
          <Typography color="rgba(255,255,255,0.7)">—</Typography>
        ) : (
          dice.map(({ value, die }) => (
            <Stack key={die.id} direction="row" alignItems="center" gap={0.5}>
              <Typography color="white">{value}</Typography>
              <DicePreview diceStyle={die.style} diceType={die.type} size="small" />
            </Stack>
          ))
        )}
      </Stack>
    </Stack>
  );
}

function combination(dice: Dice) {
  if (dice.combination === "HIGHEST") {
    return ">";
  } else if (dice.combination === "LOWEST") {
    return "<";
  } else if (dice.combination === "NONE") {
    return ",";
  } else {
    return "+";
  }
}

function sortDice(
  die: Die[],
  rollValues: Record<string, number>,
  combination: "HIGHEST" | "LOWEST" | "SUM" | "NONE" | undefined
) {
  return die.sort((a, b) => {
    const aValue = rollValues[a.id];
    const bValue = rollValues[b.id];
    if (combination === "HIGHEST") {
      return bValue - aValue;
    } else if (combination === "LOWEST") {
      return aValue - bValue;
    } else {
      return 0;
    }
  });
}

function DiceResultsExpanded({
  diceRoll,
  rollValues,
}: {
  diceRoll: DiceRoll;
  rollValues: Record<string, number>;
}) {
  const die = useMemo(
    () =>
      sortDice(diceRoll.dice.filter(isDie), rollValues, diceRoll.combination),
    [diceRoll, rollValues]
  );
  const dice = useMemo(() => diceRoll.dice.filter(isDice), [diceRoll]);

  return (
    <Stack divider={<Divider />} gap={1}>
      <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
        {die.map((d, i) => (
          <Stack direction="row" key={d.id} gap={1}>
            <DicePreview diceStyle={d.style} diceType={d.type} size="small" />
            <Typography lineHeight="28px" color="white">
              {rollValues[d.id]}
            </Typography>
            {i < die.length - 1 && (
              <Typography lineHeight="28px" color="white">
                {combination(diceRoll)}
              </Typography>
            )}
          </Stack>
        ))}
        {die.length > 0 && (
          <>
            <Typography lineHeight="28px" color="white">
              =
            </Typography>
            <Typography lineHeight="28px" color="white">
              {getCombinedDiceValue(
                { dice: die, combination: diceRoll.combination },
                rollValues
              )}
            </Typography>
          </>
        )}
      </Stack>
      {dice.map((d, i) => (
        <DiceResultsExpanded key={i} diceRoll={d} rollValues={rollValues} />
      ))}
      {diceRoll.bonus && (
        <Typography textAlign="center" lineHeight="28px" color="white">
          {diceRoll.bonus > 0 && "+"}
          {diceRoll.bonus}
        </Typography>
      )}
    </Stack>
  );
}
