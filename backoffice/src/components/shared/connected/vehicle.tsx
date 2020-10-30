import React from "react";
import { observer } from "mobx-react";

import { classNamesPrefix } from "utils/react";

import state from "state";

import { useCallback } from "hooks";

import {
  IconTruck,
  IconLocation,
  IconSpeed,
  IconTemperature,
} from "components/shared/icons";

import "./vehicle.scss";
import { Button } from "../inputs";
import moment from 'moment';

const block = "driver";
const cx = classNamesPrefix(block);

type DriverProps = {
  id: string;
  name: string;
  vehicle: string;
  location: number[];
  online: boolean;
  speed: number;
  temperature: number;
  plate: string;
  updatedAt : string
};

const Vehicle = observer(
  ({
    id,
    name,
    vehicle,
    location,
    online,
    speed,
    temperature,
    plate,
    updatedAt
  }: DriverProps) => {
    const onChangeStatus = async () => {
      try {
        await state.vehicles.changeStatus(!online ? "online" : "offline", id);
      } catch (error) {}
    };

    return (
      <div className={block}>
        {/* Info (name, vehicle and update time */}
        <div
          className={cx("__group", "__vehicle", {
            "no-mobile": !name,
          })}
        >
          <IconTruck className={cx("__icon", "__vehicle-icon")} />
          <div className={cx("__column", "__vehicle-info")}>
            <div className={cx("__vehicle-name")}>{name}</div>
            <div className={cx("__vehicle-description")}>
              {vehicle} ({plate})
            </div>
            <div className={cx("__vehicle-description")}>
              {updatedAt && moment(updatedAt).format('DD/MM/YYYY-HH:mm:ss')}
            </div>
          </div>
        </div>

        <div
          className={cx("__group", "__location", {
            "__location--hidden": !location,
          })}
        >
          <IconSpeed className={cx("__icon", "__location-icon")} />
          <div className={cx("__column", "__location-info")}>
            <div className={cx("__location-theme")}>{speed} KM/H</div>
          </div>
        </div>

        <div
          className={cx("__group", "__location", {
            "__location--hidden": !location,
          })}
        >
          <IconTemperature className={cx("__icon", "__location-icon")} />
          <div className={cx("__column", "__location-info")}>
            <div className={cx("__location-theme")}>{temperature} °C</div>
          </div>
        </div>

        {/* Location */}
        <div
          className={cx("__group", "__location", {
            "__location--hidden": !location,
          })}
        >
          <IconLocation className={cx("__icon", "__location-icon")} />
          <div className={cx("__column", "__location-info")}>
            <div className={cx("__location-theme")}>
              {parseFloat(location[0].toFixed(3))}
              {", "}
              {parseFloat(location[1].toFixed(3))}
            </div>
          </div>
        </div>

        {/* Buttons ([Online|Offline]) */}
        <div className={cx("__group", "__buttons")}>
          {/* FIXME */}
          <Button key={id} onClick={onChangeStatus} style={{ padding: "4px 8px" }}>
            {online ? "Déconnexion" : "Se connecter"}
          </Button>
        </div>
      </div>
    );
  }
);

export default Vehicle;
