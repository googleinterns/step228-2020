/* Copyright (c) 2012 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

package com.google.sps.servlets;

import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoListResponse;
import com.google.api.services.youtube.model.VideoSnippet;
import com.google.api.services.youtube.model.VideoStatistics;
import com.google.sps.data.YTVid;
import java.io.*;
import java.io.IOException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

public class Search {
  public static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
  public static final JsonFactory JSON_FACTORY = new JacksonFactory();
  private static final long NUMBER_OF_VIDEOS_RETURNED = 6;

  /** Initialize a YouTube object to search for videos on YouTube */
  private static YouTube youtube;

  /** Initialize a YouTube object to search for videos on YouTube */
  public static ArrayList<YTVid> getData(String regionCode, String categoryId) {
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
              .setApplicationName("search-by-location")
              .build();

      // Define the API request for retrieving result.
      YouTube.Videos.List search = youtube.videos().list("snippet,contentDetails,statistics");

      search.setKey(apiKey);
      search.setMaxResults(NUMBER_OF_VIDEOS_RETURNED);
      search.setRegionCode(regionCode);
      search.setVideoCategoryId(categoryId);
      search.setChart("mostPopular");

      // Call the API and return results.
      VideoListResponse searchResponse = search.execute();
      List<Video> searchResultList = searchResponse.getItems();

      if (searchResultList != null) {
        return convertToYTVid(searchResultList.iterator());
      } else {
        System.err.println("Result of the search was null");
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
    return new ArrayList<YTVid>();
  }

  /*
   * function that creates YTVid file from singleVideo object
   */
  private static ArrayList<YTVid> convertToYTVid(Iterator<Video> iteratorSearchResults) {
    ArrayList<YTVid> result = new ArrayList<>();
    while (iteratorSearchResults.hasNext()) {
      Video singleVideo = iteratorSearchResults.next();

      /** Get metadata about YouTube video */
      VideoSnippet videoDetails = singleVideo.getSnippet();
      String channelName = videoDetails.getChannelTitle();

      /** Get statistics for YouTube video: like + view count */
      VideoStatistics videoStats = singleVideo.getStatistics();
      BigInteger viewCount = videoStats.getViewCount();
      BigInteger likeCount = videoStats.getLikeCount();

      String Id = singleVideo.getId();
      /** id of video */
      YTVid video = new YTVid(Id, channelName, viewCount, likeCount);
      result.add(video);
    }
    return result;
  }
}
