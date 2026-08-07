import Home from './[locale]/page';
import { DEFAULT_LOCALE } from '@/lib/config';

export default function Page() {
  return <Home params={{ locale: DEFAULT_LOCALE }} />;
}