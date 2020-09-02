// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.data;
import java.math.BigInteger;

/**
 * Class that constructs a YTVid object from a base link and an id which uniquely identifies a
 * YouTube video. The object also contains YouTube video metadata: title of video,
 * channel name, view count and like count.
 */
public final class YTVid {

  private final String id;
  private final String title;
  private final String channelName;
  private final BigInteger viewCount;
  private final BigInteger likeCount;
  private final String embeddedLink;

  public YTVid(String id, String title, String channelName,
    BigInteger viewCount, BigInteger likeCount) {
    this.id = id;
    this.title = title;
    this.channelName = channelName;
    this.viewCount = viewCount;
    this.likeCount = likeCount;
    this.embeddedLink = "https://www.youtube.com/embed/" + id;
  }
}
