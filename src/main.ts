import "./block-fly/app";
import { registerSW } from "virtual:pwa-register";

// TODO: make popups to confirm refresh
const updateSW = registerSW({
  onOfflineReady() {
    console.log("FULLY READY FOR OFFLINE");
  },
  onNeedRefresh() {
    console.log("NEW VERSION AVAILABLE, REFRESHING!");
    updateSW();
  },
});
