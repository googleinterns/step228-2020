import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import twitter4j.conf.ConfigurationBuilder;
import twitter4j.Trend;
import twitter4j.Trends;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.Location;
@WebServlet("/twitter")
public class TwitterServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json; charset=UTF-8");

    
    int woeid = Integer.parseInt(request.getParameter("woeid"));

    try {
      Trend[] trendingTopics = getTwitterResponse(woeid);
      response.getWriter().println(new Gson().toJson(trendingTopics));
    } catch (TwitterException twitterException) {
      System.out.println(twitterException.getMessage());
    }
  }

  /** 
   * returns an array of Trend objects corresponding to the given woeid
   * @see twitter4j.Trend
   */
  private Trend[] getTwitterResponse(int woeid) throws TwitterException {
    Twitter twitter = new TwitterFactory().getInstance();
    for(Location l : twitter.getAvailableTrends()) {
        if(l.getPlaceCode() == 12){ // checking if the location is a country, if you want to see towns/states remove this
          System.out.println(l);
        }
    }
    return twitter.getPlaceTrends(woeid).getTrends();
  }
}
