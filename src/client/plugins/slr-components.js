import SlrButton from '@/client/components/ui/SlrButton'
import SlrLoader from '@/client/components/ui/SlrLoader'
import SlrLogo from '@/client/components/ui/SlrLogo'
import SlrProgress from '@/client/components/ui/SlrProgress'
import SlrIcon from '@/client/components/ui/SlrIcon'
import SlrTimer from '@/client/components/ui/SlrTimer'
import SlrTabs from '@/client/components/ui/SlrTabs'
import SlrTab from '@/client/components/ui/SlrTabs/SlrTab'
import SlrCheckbox from '@/client/components/ui/SlrCheckbox'
import SlrPopper from '@/client/components/ui/SlrPopper'
import SlrCopyButton from '@/client/components/ui/SlrCopyButton'

export default function registerSlrComponents (app) {
  app.component('slr-button', SlrButton)
  app.component('slr-loader', SlrLoader)
  app.component('slr-logo', SlrLogo)
  app.component('slr-progress', SlrProgress)
  app.component('slr-icon', SlrIcon)
  app.component('slr-timer', SlrTimer)
  app.component('slr-tabs', SlrTabs)
  app.component('slr-tab', SlrTab)
  app.component('slr-checkbox', SlrCheckbox)
  app.component('slr-popper', SlrPopper)
  app.component('slr-copy-button', SlrCopyButton)
}
