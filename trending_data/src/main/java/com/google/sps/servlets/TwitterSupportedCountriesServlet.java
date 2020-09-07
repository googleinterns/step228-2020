import com.google.gson.Gson;
import java.io.IOException;
import java.util.HashSet;
import java.util.Iterator;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import twitter4j.Location;
import twitter4j.ResponseList;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;

@WebServlet("/twitter-supported-countries")
public class TwitterSupportedCountriesServlet extends HttpServlet {
  /** This variable is empty upon class instantion */
  HashSet<String> twitterSupportedCountries = new HashSet<>();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    try {
      if (twitterSupportedCountries.isEmpty()) {
        /**
         * if this is the first request, fetch the supported countries this will only occur once,
         * right after the servlet is instantiated
         */
        Twitter twitter = new TwitterFactory().getInstance();
        twitterSupportedCountries = convertToSetOfCountryCodes(twitter.getAvailableTrends());
      }
      response.setContentType("application/json;");
      response.getWriter().println(new Gson().toJson(twitterSupportedCountries));
    } catch (NumberFormatException nfException) {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      System.out.println(nfException.getMessage());
    } catch (TwitterException twitterException) {
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
      System.out.println(twitterException.getMessage());
    }
  }

  /**
   * Create a set of alpha 2 codes which correspond to a list of Twitter Locations. Does not allow
   * duplicates.
   *
   * @see twitter4j.Location
   */
  private HashSet<String> convertToSetOfCountryCodes(ResponseList<Location> locations) {
    HashSet<String> countryCodes = new HashSet<>();
    Iterator<Location> iterator = locations.iterator();

    while (iterator.hasNext()) {
      Location currentLocation = iterator.next();
      countryCodes.add(currentLocation.getCountryCode());
    }
    return countryCodes;
  }
}
