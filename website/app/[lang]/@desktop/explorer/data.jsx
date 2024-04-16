import { Card, CardBody, Divider } from "@nextui-org/react";

export default function BlockChainData({ data,transcript }) {
    const totalpioneer = Number.parseInt(data.lockuptime[0].no_lock+
        data.lockuptime[0].oneyear+
        data.lockuptime[0].sixmonths+
        data.lockuptime[0].threeyear+
        data.lockuptime[0].twoweek).toLocaleString("en-US")
  return (
    <Card>
      <CardBody>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section className="text-left">
            <h1 className="text-left mb-2 font-semibold">BlockChain Data</h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="">{transcript.statistic.Metrics.TotalAccount}</div>
            <div className="text-right">{Number.parseInt(data.metric.TotalAccount).toLocaleString("en-US")}</div>
            <div className="">{transcript.statistic.Metrics.TotalPioneer}</div>
            <div className="text-right">{totalpioneer}</div>
            <div className="">{transcript.statistic.Metrics.MigratedPi}</div>
            <div className="text-right">{Number.parseFloat(data.metric.TotalPi).toLocaleString("en-US",{maximumFractionDigits:7})} Pi</div>
            <div className="">Total Account</div>
            <div className="text-right">Total Account</div>
            <div className="">Total Account</div>
            <div className="text-right">Total Account</div>
          </div>
          </section>
          <section className="text-left">
          <h1 className="mb-2 font-semibold">24H Data</h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 ">
            <div className="">Total Account</div>
            <div className="text-right">13,744,445</div>
            <div className="">AvG. Ledger Time</div>
            <div className="text-right">5s</div>
            <div className="">TPS</div>
            <div className="text-right">5</div>
            <div className="">Total Account</div>
            <div className="text-right">Total Account</div>
            <div className="">Total Account</div>
            <div className="text-right">Total Account</div>
          </div>
          </section>
        </div>
      </CardBody>
    </Card>
  );
}
