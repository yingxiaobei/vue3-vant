import { ref, onMounted } from "vue";
import { getCode } from "@/api/dic";
export function useDic(codeType: string, code: string = "-1") {
  const options = ref([]);
  onMounted(() => {
    getCode(codeType, code)
      .then((res) => {
        options.value = (res?.rows || []).map((m: Record<string, any>) => ({
          label: m.codeValue,
          value: m.codeKey,
        }));
      })
      .catch(() => {
        options.value = [];
      });
  });
  return options;
}
