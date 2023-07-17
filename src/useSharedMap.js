import { useState, useEffect, useCallback, useRef } from "react";
import { initMap } from "@dstanesc/shared-tree-map";
import { v4 as uuid } from "uuid";

export function useSharedMap() {
  const [sharedMap, setSharedMap] = useState(null);
  const [localModel, setLocalModel] = useState(new Map());

  useEffect(() => {
    const initializeMap = async () => {
      let mapId = window.location.hash.substring(1) || undefined;
      console.log("mapId", mapId);
      const map = await initMap(mapId, undefined);
      if (mapId === undefined) {
        mapId = map.mapId();
        window.location.hash = mapId;
      } else {
        const existing = map.asMap();
        setLocalModel(existing);
      }
      setSharedMap(map);
    };
    initializeMap();
  }, []);

  useEffect(() => {
    if (sharedMap) {
      const binder = sharedMap.getBufferingBinder();
      binder.bindOnChange(
        (key, value) => {
          setLocalModel((prevModel) => {
            const updatedModel = new Map(prevModel);
            updatedModel.set(key, value);
            return updatedModel;
          });
        },
        (key) => {
          setLocalModel((prevModel) => {
            const updatedModel = new Map(prevModel);
            updatedModel.delete(key);
            return updatedModel;
          });
        }
      );
      return () => {
        binder.unregisterAll();
      };
    }
  }, [sharedMap]);

  const roll = useCallback(() => {
    for (const key of sharedMap.keys()) {
      sharedMap.set(key, randomString());
    }
  }, [sharedMap]);

  const add = useCallback(() => {
    sharedMap.set(uuid(), randomString());
  }, [sharedMap]);

  const remove = useCallback(
    (key) => {
      sharedMap.delete(key);
    },
    [sharedMap]
  );

  const randomString = () => {
    const randomNumber = Math.floor(Math.random() * 998) + 1;
    return randomNumber.toString();
  };

  return [localModel, add, remove, roll];
}
