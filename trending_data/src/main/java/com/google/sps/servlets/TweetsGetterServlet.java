import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import twitter4j.Query;
import twitter4j.QueryResult;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;

/**
 * Given a search query, return a JSON array of Strings containing the ids of the top 5 most
 * recent/popular (mixed) tweets
 */
@WebServlet("/get-tweets")
public class TweetsGetterServlet extends HttpServlet {
  // The maximum number of tweets returned
  static final int NUMBER_OF_TWEETS = 5;

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json; charset=UTF-8");
    String query = request.getParameter("query");
    try {
      List<String> tweetIds = getTweetIds(query);
      response.getWriter().println(new Gson().toJson(tweetIds));
    } catch (TwitterException twException) {
      response.getWriter().println(new Gson().toJson(Collections.emptyList()));
    }
  }
  /**
   * Returns a list of strings of tweet ids corresponding to the given queries. The size of the list
   * <= NUMBER_OF_TWEETS.
   */
  private List<String> getTweetIds(String query) throws TwitterException {
    Twitter twitter = new TwitterFactory().getInstance();
    QueryResult qr = twitter.search().search(new Query(query).count(NUMBER_OF_TWEETS));
    List<String> tweetIds = new ArrayList<String>();
    for (Status s : qr.getTweets()) {
      tweetIds.add(String.valueOf(s.getId()));
    }
    return Collections.unmodifiableList(tweetIds);
  }
}
