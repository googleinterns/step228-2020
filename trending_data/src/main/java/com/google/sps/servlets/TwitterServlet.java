import com.google.gson.Gson;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import twitter4j.Trend;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;

@WebServlet("/twitter")
public class TwitterServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json; charset=UTF-8");
    try {
      int woeid = Integer.parseInt(request.getParameter("woeid"));
      Collection<Trend> trends = getTrends(woeid);
      response.getWriter().println(new Gson().toJson(trends));
    } catch (NumberFormatException nfException) {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      System.out.println(nfException.getMessage());
    } catch (TwitterException twitterException) {
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
      System.out.println(twitterException.getMessage());
    }
  }

  /**
   * returns an unmodifiable Collection that contains the top 10 Trend objects corresponding to the
   * given WOEID
   *
   * @see twitter4j.Trend
   */
  private Collection<Trend> getTrends(int woeid) throws TwitterException {
    Twitter twitter = new TwitterFactory().getInstance();
    Trend[] trends = twitter.getPlaceTrends(woeid).getTrends();
    return Collections.unmodifiableList(Arrays.asList(trends));
  }
}
