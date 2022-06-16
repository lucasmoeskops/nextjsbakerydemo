import '../styles/bootstrap.min.scss';
import '../styles/font-marcellus.css';
import '../styles/font-open-sans.css';
import '../styles/main.css';

import { RecoilRoot } from 'recoil';
import { IconDefs } from '../components/atoms/Icon/IconDefs';

export default function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <IconDefs />
      <Component {...pageProps} />
    </RecoilRoot>
  )
}