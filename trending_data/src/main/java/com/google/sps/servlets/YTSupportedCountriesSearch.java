package com.google.sps.servlets;

import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.I18nRegion;
import com.google.api.services.youtube.model.I18nRegionListResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

public class YTSupportedCountriesSearch {
  public static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
  public static final JsonFactory JSON_FACTORY = new JacksonFactory();

  /** Declare a YouTube object to search for videos on YouTube */
  private static YouTube youtube;

  /*
   * Return a list of ids of supported countries as specified by the
   * YouTube API. The ids are the country codes in the format of Alpha-2 codes.
   */
  public static ArrayList<String> getSupportedCountries() {
    try {
      Properties properties = new Properties();
      InputStream in = Search.class.getResourceAsStream("/config.properties");
      properties.load(in);
      String apiKey = properties.getProperty("APIkey");

      // Object to make YouTube Data API requests
      youtube =
          new YouTube.Builder(
                  HTTP_TRANSPORT,
                  JSON_FACTORY,
                  new HttpRequestInitializer() {
                    public void initialize(HttpRequest request) throws IOException {}
                  })
              .setApplicationName("search-unsupported-countries")
              .build();

      // Define and execute the API request
      YouTube.I18nRegions.List request = youtube.i18nRegions().list("snippet");

      request.setKey(apiKey);
      request.setHl("es_MX");

      I18nRegionListResponse response = request.execute();
      List<I18nRegion> supportedCountriesResponse = response.getItems();

      if (supportedCountriesResponse != null) {
        ArrayList<String> supportedCountriesCodes =
            convertToListOfCountryCodes(supportedCountriesResponse.iterator());
        return supportedCountriesCodes;
      }
    } catch (GoogleJsonResponseException e) {
      System.err.println(
          "There was a service error: "
              + e.getDetails().getCode()
              + " : "
              + e.getDetails().getMessage());
    } catch (IOException e) {
      System.err.println("There was an IO error: " + e.getCause() + " : " + e.getMessage());
    } catch (Throwable t) {
      t.printStackTrace();
    }
    return new ArrayList<String>();
  }

  /*
   * Creates a list of Alpha-2 codes by getting the id of each region in the
   * list of I18nRegion objects
   */
  private static ArrayList<String> convertToListOfCountryCodes(
      Iterator<I18nRegion> iteratorSearchResults) {
    ArrayList result = new ArrayList<>();
    while (iteratorSearchResults.hasNext()) {
      I18nRegion region = iteratorSearchResults.next();
      String id = region.getId(); // this is the country code of the region (Alpha-2 code)
      result.add(id);
    }
    return result;
  }
}
