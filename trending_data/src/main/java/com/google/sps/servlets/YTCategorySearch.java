package com.google.sps.servlets;

import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.VideoCategory;
import com.google.api.services.youtube.model.VideoCategoryListResponse;
import com.google.sps.data.YTCategory;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

public class YTCategorySearch {
  public static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
  public static final JsonFactory JSON_FACTORY = new JacksonFactory();

  /** Declare a YouTube object to search for videos on YouTube */
  private static YouTube youtube;

  /*
   * Return a list of ids of supported countries as specified by the
   * YouTube API. The ids are the country codes in the format of Alpha-2 codes.
   */
  public static ArrayList<YTCategory> getCategories(String regionCode) {
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
              .setApplicationName("search-yt-categories")
              .build();

      // Define and execute the API request
      YouTube.VideoCategories.List request = youtube.videoCategories().list("snippet");

      request.setKey(apiKey);
      request.setRegionCode(regionCode);

      VideoCategoryListResponse response = request.execute();
      List<VideoCategory> videoCategories = response.getItems();

      if (videoCategories != null) {
        return convertToListOfCategories(videoCategories.iterator(), regionCode);
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
    return new ArrayList<YTCategory>();
  }

  /**
   * Creates a list of Alpha-2 codes by getting the id of each region in the list of I18nRegion
   * objects
   */
  private static ArrayList<YTCategory> convertToListOfCategories(
      Iterator<VideoCategory> iteratorSearchResults, String regionCode) {
    ArrayList<YTCategory> result = new ArrayList<>();
    // if (!regionCode.equals("EG") && !regionCode.equals("LY")) {
    //   // default category does not work for Egypt and Libya
      result.add(new YTCategory("0", "Default"));
    //}
    while (iteratorSearchResults.hasNext()) {
      VideoCategory category = iteratorSearchResults.next();
      if (category.getSnippet().getAssignable()) {
        String name = category.getSnippet().getTitle();
        String id = category.getId();
        // if (!Search.getData(regionCode, id).isEmpty()) {
          result.add(new YTCategory(id, name)); 
        //}
      }
    }
    return result;
  }
}
