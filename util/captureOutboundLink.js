export default (url) => {
    try {
        window.gtag('event', 'click', {
            'event_category': 'outbound',
            'event_label': url,
            'transport_type': 'beacon'
        });
    } catch (err) {
        console.error(err)
    }
    return false;
}