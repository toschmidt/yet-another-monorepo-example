import { ExampleModel } from '@yame/types';
import { useGet, UseGetReturn } from 'restful-react';

const apiPath = '/examples';

export function useGetExamples(): UseGetReturn<ExampleModel[], string> {
  return useGet<ExampleModel[]>({ path: apiPath });
}
