export let twitterSupportedCountries;
export let ytSupportedCountries;
export let countriesWithSomeData;

getSupportedCountries();

/**
*@return {Array}
*/
export async function getSupportedCountries() {
  /** Fetch countries supported by YouTube and Twitter API */
  twitterSupportedCountries = await
  fetchSupportedCountries('/twitter-supported-countries');
  ytSupportedCountries = await
  fetchSupportedCountries('/yt-supported-countries');
  /** Find which countries are supported by at least one platform */
  countriesWithSomeData = union(ytSupportedCountries,
      twitterSupportedCountries);
  return countriesWithSomeData;
}

/** Computes the union of two arrays that are
* passed by refference.
* @param {Array} arr1Ref
* @param {Array} arr2Ref
* @return {Array} result of union
*/
function union(arr1Ref, arr2Ref) {
/** Arrays are passed by reference so
copy them to new variables so as not to
change the initial arrays */
  const arr1 = arr1Ref.slice();
  const arr2 = arr2Ref.slice();

  const res=[]; /** will contain the union */

  for (let i = 0; i < arr1.length; i++) {
    res.push(arr1[i]);
    if (arr2.includes(arr1[i])) {
      /** Remove duplicates - items that are both in
      arr1 and arr2*/
      arr2.splice(arr2.indexOf(arr1[i]), 1);
    }
  }
  /** Add whatever is left in second array */
  return res.concat(arr2);
}

/**
 * Fetches supported countries from specified servlet.
 * @param {String} url url of servlet to fetch from
 * @return {Array} the countries supported by one of the platforms
 */
async function fetchSupportedCountries(url) {
  const response = await fetch(url);
  const supported = await response.json();
  return supported;
}
