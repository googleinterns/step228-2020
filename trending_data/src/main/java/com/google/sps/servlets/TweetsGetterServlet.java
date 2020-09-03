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

@WebServlet("/get-tweets")
public class TweetsGetterServlet extends HttpServlet {
  static final int NUMBER_OF_TWEETS = 5;

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json; charset=UTF-8");
    String query = request.getParameter("query");
    System.out.println(query);
    try {
      List<String> tweetIds = getTweetIds(query);
      response.getWriter().println(new Gson().toJson(tweetIds));
    } catch (TwitterException twException) {
      response.getWriter().println("[]");
    }
  }

  private List<String> getTweetIds(String query) throws TwitterException {
    Twitter twitter = new TwitterFactory().getInstance();
    QueryResult qr = twitter.search().search(new Query(query));
    List<String> tweetIds = new ArrayList<String>();
    for (Status s : qr.getTweets()) {
      tweetIds.add(s.getId() + "");
      if (tweetIds.size() == NUMBER_OF_TWEETS) break;
    }
    return Collections.unmodifiableList(tweetIds);
  }
}
