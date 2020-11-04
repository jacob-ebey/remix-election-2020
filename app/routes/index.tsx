import React, { useCallback, useMemo } from "react";
import { useRouteData } from "@remix-run/react";

import map from "react-usa-map";

const USAMap = typeof map === "function" ? map : map.default;

export function meta() {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
}

export function headers() {
  return {
    "cache-control": "public, max-age=300, s-max-age=3600",
  };
}

export default function Index() {
  let data = useRouteData();

  const { presidentData } = data;

  const partyControl = useMemo(
    () =>
      presidentData.party_control.find((c: any) => c.race_type === "president"),
    [presidentData]
  );

  const democratsAhead =
    partyControl.parties.democrat.count > partyControl.parties.republican.count;

  const handleMapClicked = useCallback(
    (event) => {
      const stateId = event.target.dataset.name;

      const race = presidentData.races.find(
        (race: any) => race.state_id === stateId && race.officeid === "P"
      );

      console.log(race);
    },
    [presidentData]
  );

  const mapCustomization = useMemo(() => {
    return presidentData.races.reduce((p: {}, race: any) => {
      if (!race.state_id || race.officeid !== "P") {
        return p;
      }

      return {
        ...p,
        [race.state_id]: {
          fill: race.leader_party_id === "republican" ? "red" : "blue",
        },
      };
    }, {});
  }, [presidentData]);

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Welcome to Remix hosted on Firebase!</h2>

      {democratsAhead ? (
        <p>Looks like we are safe!</p>
      ) : (
        <p>Fuck, looking like 4 more years of bullshit.</p>
      )}

      <p>
        ⭐ {partyControl.parties.democrat.percent} (
        {partyControl.parties.democrat.count} of {partyControl.total})
      </p>
      <p>
        💩 {partyControl.parties.republican.percent} (
        {partyControl.parties.republican.count} of {partyControl.total})
      </p>
      <p>{partyControl.needed_for_control} needed for control</p>
      <USAMap customize={mapCustomization} onClick={handleMapClicked} />
    </div>
  );
}
