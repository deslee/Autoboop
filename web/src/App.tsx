import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { CssBaseline, Typography, Dialog, DialogTitle, DialogContent, Link, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useAutoboop, { Step } from './useAutoboop';
import BoopEffect from './BoopEffect';
import { analytics } from './firebase';
import CloseIcon from '@material-ui/icons/Close';
import { calculateImageDimensions } from './calculateImageDimensions';

const isMobile = (process as any).browser && 'ontouchstart' in document.documentElement

const useStyles = makeStyles(theme => ({
  root: {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer'
  },
  prompt: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: theme.spacing(.5, 1),
    userSelect: 'none'
  },
  about: {
    zIndex: 11,
    position: 'absolute',
    top: 0,
    right: 0,
    background: 'rgba(255,255,255,.5)',
    padding: theme.spacing(.5, 1)
  },
  score: {
    zIndex: 11,
    position: 'absolute',
    top: 0,
    left: 0,
    background: 'rgba(255,255,255,.5)',
    padding: theme.spacing(.5, 1)
  },
  dialogCloseButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1)
  }
}))

const catStepsMessage: {
  [x in Step]: string
} = {
  promptUserToMovePointer: !isMobile ? "Move your cursor around" : "Tap anywhere",
  promptUserToHoldStill: !isMobile ? "Detecting pointer... Hold still!" : "Hold still!",
  retrievingImage: "Here it comes...",
  showingImage: "Here it comes...",
  imageLoaded: "",
}

function App() {
  const classes = useStyles()
  const [container, image, state] = useAutoboop<HTMLDivElement>();
  const [aboutDialog, setAboutDialog] = useState(false)
  const onClickAbout = useCallback(() => {
    analytics.logEvent('click_about', {
      score: state.boops
    });
    setAboutDialog(true)
  }, [state.boops])

  const trackOutbound = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    analytics.logEvent('outbound', {
      url: (e.target as any).href,
      score: state.boops
    })
  }, [state.boops])

  useEffect(() => {
    console.debug(JSON.stringify(state))
  }, [state])

  const onUnload = useCallback(() => {
    analytics.logEvent('score', {
      score: state.boops
    })
  }, [state.boops])

  useEffect(() => {
    window.addEventListener('unload', onUnload, { passive: true })

    return () => {
      window.removeEventListener('unload', onUnload)
    }
  }, [onUnload])

  const imageDimensions = useMemo(() => {
    if (!container.current || !state.cat) {
      return
    }
    const { width: catWidth, height: catHeight, x: catX, y: catY } = state.cat;
    const { width: containerWidth, height: containerHeight } = container.current.getBoundingClientRect()

    return calculateImageDimensions({
        catWidth, catHeight, catX, catY, containerWidth, containerHeight,
        cursorX: state.position.x, cursorY: state.position.y,
        zoom: 1, fileName: state.cat?.fileName || ''
      })
  }, [state.cat, state.position, container])

  useEffect(() => {
    if (imageDimensions) {
      analytics.logEvent('boop_cat', imageDimensions)
    }
  }, [imageDimensions])

  return (
    <div className={classes.root} ref={container}>
      <Dialog fullWidth={true} maxWidth="sm" open={aboutDialog} onClose={() => setAboutDialog(false)} aria-labelledby="About">
        <DialogTitle id="About">Autoboop <IconButton className={classes.dialogCloseButton} aria-label="close" onClick={() => setAboutDialog(false)}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>Boop some cats!</Typography>
          <Typography gutterBottom>Created by <Link href="https://le3.io" onClick={trackOutbound}>Desmond Lee</Link></Typography>
          <Typography align="right" gutterBottom><Link href="https://github.com/deslee/autoboop" onClick={trackOutbound}>Source</Link></Typography>
        </DialogContent>
      </Dialog>
      {state.step === 'imageLoaded' && <BoopEffect {...state.position} />}
      <img ref={image} alt="" style={{ ...imageDimensions, position: 'absolute', visibility: state.step === 'showingImage' || state.step === 'imageLoaded' ? 'visible' : 'hidden' }} />
      <div className={classes.prompt}>
        <Typography variant="h2">{catStepsMessage[state.step]}</Typography>
      </div>
      <CssBaseline />
      <Typography variant="caption" className={classes.score}>You've booped {state.boops} cats</Typography>
      <Typography variant="caption" className={classes.about} onClick={onClickAbout}>About</Typography>
      {state.step === 'imageLoaded' &&
        <div style={{
          backgroundImage: `url(${image.current?.src})`,
          backgroundSize: 'cover',
          top: 0,
          left: 0,
          position: 'absolute',
          height: '100%',
          width: '100%',
          zIndex: -1
        }}>
          <div style={{ backdropFilter: 'blur(100px)', WebkitBackdropFilter: 'blur(100px)', width: '100%', height: '100%' }}></div>
        </div>}
    </div>
  );
}

export default App;
