import './App.css';

import React from "react";
import Header from "./Header";
import {
  init,
  loadRemote,
  registerRemotes,
} from "@module-federation/enhanced/runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

init({
  name: "host",
  remotes: [],
});

const App = () => {
  const [records, setRecords] = useState<AppRecord[]>([]);
  const [refresh, setRefresh] = useState(false);
  const isFirstRender = useRef(true);

  const fetchRecords = useCallback(async () => {
    const response = await fetch("/assets/apps_list.json");
    const data = await response.json();
    loadApps(data);
  }, []); 

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchRecords();
    }
  }, []); 

  const onAppLoading = useCallback(async (app: AppRecord) => {
    app.loading = true;
    setRefresh((prev) => !prev); 
  }, []);

  const onAppsLoaded = useCallback(async (app: AppRecord, module: any) => {
    app.module = module.default;
    app.error = undefined;
    app.loading = false;
    setRefresh((prev) => !prev); 
  }, []);

  const onAppsfailed = useCallback(async (app: AppRecord, error: any) => {
    app.module = undefined;
    app.error = error;
    app.loading = false;
    console.log("Error",error)
    setRefresh((prev) => !prev); 
  }, []);

  const loadApps = useCallback(async (apps: AppRecord[]) => {
    setRecords(apps);
    const remotes = apps.map((record) => ({
      name: record.key,
      alias: record.key,
      entry: record.externalAppConfig.remoteEntry,
    }));
    registerRemotes(remotes);
    loadRemoteApps(apps, onAppLoading, onAppsLoaded, onAppsfailed);
  }, []);

  const loadRemoteApps = async (
    apps: AppRecord[],
    loading: (app: AppRecord) => void,
    success: (app: AppRecord, module: any) => void,
    failure: (app: AppRecord, error: any) => void
  ) => { 
    apps.forEach(async (app: AppRecord) => {
      try {
        loading(app);
        const path = `${app.key}/${app.externalAppConfig.module}`;
        const remoteComponent = await loadRemote(path);
        success(app, remoteComponent);
      } catch (error) {
        failure(app, error);
      }
    });
  };

  return (
    <div className="content">
      <Header title="Host" />
      <div className="remote-apps-container">
        <ul>
          {records.map((record) => {
            const AppComponent = record.module;
            return (
              <li key={record.id}>
                <React.Suspense fallback={<div>Loading...</div>}>
                  {AppComponent && AppComponent ? <AppComponent /> : <div>No App Loaded</div>}
                </React.Suspense>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default App;

interface AppRecord {
  id: number;
  name: string;
  key: string;
  error?: any | undefined;
  loading?: boolean | undefined;
  module?: any | undefined;
  externalAppConfig: {
    remoteEntry: string;
    module: string;
  };
}