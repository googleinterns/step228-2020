import com.google.gson.Gson;
import com.google.sps.data.TwitterResponse;
import com.google.sps.data.TrendingTopic;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/twitter")
public class TwitterServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json; charset=UTF-8");
    String woeid = request.getParameter("woeid");

    Collection<TrendingTopic> trendingTopics = getTrendingTopics(woeid);
    response.getWriter().println(new Gson().toJson(trendingTopics));
  }

  /** 
   * returns a Collection of all the TrendingTopics returned by the Twitter API for this WOEID
   */
  private Collection<TrendingTopic> getTrendingTopics(String woeid) {
    // get all twitter responses
    TwitterResponse[] twitterResponses = getTwitterResponses(woeid);

    Collection<TrendingTopic> trendingTopics = new ArrayList<TrendingTopic>();

    // for each twitter response add all trending topics in it to the
    // collections of trending topics
    for (TwitterResponse twitterResponse : twitterResponses) {
      Collections.addAll(trendingTopics, twitterResponse.getTrends());
    }
    return trendingTopics;
  }
  /**
   * returns an array of TwitterResponses where each twitter response contains an array of
   * TrendingTopics for this WOEID
   */
  private TwitterResponse[] getTwitterResponses(String woeid) {
    // String response = getTwitterResponse(woeid);
    // hard coded example of twitter response
    // TODO : replace this with the real API response
    String response =
        "[{\"trends\": [{\"name\": \"#SoMeArrependoDe\",\"url\":"
            + " \"http://twitter.com/search?q=%23SoMeArrependoDe\",\"promoted_content\":"
            + " null,\"query\": \"%23SoMeArrependoDe\",\"tweet_volume\": null},{\"name\":"
            + " \"#حزب_العاطلين_بتويتر\",\"url\":"
            + " \"http://twitter.com/search?q=%23%D8%AD%D8%B2%D8%A8_%D8%A7%D9%84%D8%B9%D8%A7%D8%B7%D9%84%D9%8A%D9%86_%D8%A8%D8%AA%D9%88%D9%8A%D8%AA%D8%B1\",\"promoted_content\":"
            + " null,\"query\":"
            + " \"%23%D8%AD%D8%B2%D8%A8_%D8%A7%D9%84%D8%B9%D8%A7%D8%B7%D9%84%D9%8A%D9%86_%D8%A8%D8%AA%D9%88%D9%8A%D8%AA%D8%B1\",\"tweet_volume\":"
            + " null}],\"as_of\": \"2017-02-08T16:18:18Z\",\"created_at\":"
            + " \"2017-02-08T16:10:33Z\",\"locations\": [{\"name\": \"Worldwide\",\"woeid\":"
            + " 1}]}]";
    
    return new Gson().fromJson(response, TwitterResponse[].class);
  }

  /** returns the JSON response from the twitter API for this WOEID */
  private String getTwitterResponse(String woeid) {
    return null;
  }
}
