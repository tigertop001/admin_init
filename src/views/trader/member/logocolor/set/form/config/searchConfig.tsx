import { computed, ref } from "vue";

export interface SearchField {
  content: number | string | null;
  type: string;
  label: string;
}

export interface ExtendedSearchField extends SearchField {
  stype: string;
  scontent: string | number | null;
  [key: string]: any;
}

export interface SearchStateType {
  start: number;
  limit: number;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
}

export const crtDFS = (): SearchStateType => ({
  start: 0,
  limit: 10
});

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit
    };

    return result;
  });

  const searchVal = computed(() => param.value);

  const onSearch = () => {
    emit("update:param", param.value);
  };

  return {
    searchState,
    searchVal,
    onSearch
  };
};
