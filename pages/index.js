import { Helmet } from "react-helmet";
import CatFinder from '../components/CatFinder/CatFinder'

export default class extends React.Component {
    render() {
        const isMobile = process.browser && 'ontouchstart' in document.documentElement

        return <React.Fragment>
            <Helmet>
                <meta charSet="utf-8" />
                <title>AutoBooper</title>
            </Helmet>
            <style global jsx>{`
                * {
                    margin: 0;
                    padding: 0;
                }
            `}</style>
            <CatFinder
                requiredDelay={200}
                isMobile={isMobile}
            />
        </React.Fragment>
    }
}