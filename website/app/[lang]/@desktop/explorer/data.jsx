import { Card, CardBody, Divider } from "@nextui-org/react";

export default function BlockChainData({ data }) {
  return (
    <Card>
      <CardBody>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section>
            <h1 className=" font-semibold">BlockChain Data</h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="">Total Account</div>
            <div className="">13,744,445</div>
            <div className="">AvG. Ledger Time</div>
            <div className="">5s</div>
            <div className="">TPS</div>
            <div className="">5</div>
            <div className="">Total Account</div>
            <div className="">Total Account</div>
            <div className="">Total Account</div>
            <div className="">Total Account</div>
          </div>
          </section>
          <section>
          <h1 className=" font-semibold">24H Data</h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 ">
            <div className="">Total Account</div>
            <div className="">13,744,445</div>
            <div className="">AvG. Ledger Time</div>
            <div className="">5s</div>
            <div className="">TPS</div>
            <div className="">5</div>
            <div className="">Total Account</div>
            <div className="">Total Account</div>
            <div className="">Total Account</div>
            <div className="">Total Account</div>
          </div>
          </section>
        </div>
      </CardBody>
    </Card>
  );
}
