import type { DataLoader } from "@remix-run/core";

const nytPresidentUrl = "https://static01.nyt.com/elections-assets/2020/data/api/2020-11-03/national-map-page/national/president.json";

let loader: DataLoader = async () => {
  const presidentRes = await fetch(nytPresidentUrl).then(r => r.json());

  return {
    presidentData: presidentRes.data,
    message: "this is awesome 😎"
  };
};

export = loader;
