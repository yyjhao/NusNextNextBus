export interface GetCallback {
    (response: string): void;
}

export interface FailCallback {
    (xhr: XMLHttpRequest): void;
}

export function get(url: string, success: GetCallback, failure: FailCallback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = ensureReadiness;

    function ensureReadiness() {
        if(xhr.readyState === 4) {
            if(xhr.status === 200) {
                success(xhr.responseText);
            } else {
                failure(xhr);
            }
        }
    }

    xhr.open('GET', url, true);
    xhr.send('');
}
