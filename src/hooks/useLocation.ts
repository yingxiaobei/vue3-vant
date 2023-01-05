import { onMounted, reactive } from "vue";
import { GPS } from "@/utils/gps";
export function useLocation(isGaode: boolean = false) {
  const position = reactive<{ lon?: number; lat?: number }>({
    lon: undefined,
    lat: undefined,
  });

  onMounted(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (isGaode) {
            const { lat, lon } = GPS.gcj_encrypt(
              pos.coords.latitude,
              pos.coords.longitude
            );
            position.lon = lon;
            position.lat = lat;
          } else {
            position.lon = pos.coords.longitude;
            position.lat = pos.coords.latitude;
          }
        },
        (e) => {
          console.log(e.message);
        },
        {
          enableHighAccuracy: true,
        }
      );
    }
  });
  return position;
}
