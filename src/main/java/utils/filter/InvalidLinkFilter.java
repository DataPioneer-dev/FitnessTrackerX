package utils.filter;

import java.io.IOException;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebFilter("/eng/*") // to filter the request , based on the current session
public class InvalidLinkFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
    	
    	String link = ((HttpServletRequest) request).getRequestURI();
    	
    	
    	switch(link)
    	{
    		case "/JSFjack/eng/home.xhtml": 
    			chain.doFilter(request, response); 
    			break;
    		case "/JSFjack/eng/register.xhtml": 
    			chain.doFilter(request, response); 
    			break;
    		case "/JSFjack/eng/user/dashbord.xhtml": 
    			chain.doFilter(request, response); 
    			break;
    		case "/JSFjack/eng/user/user.xhtml": 
    			chain.doFilter(request, response); 
    			break;
    		case "/JSFjack/eng/user/meals.xhtml": 
    			chain.doFilter(request, response); 
    			break;
    		case "/JSFjack/eng/user/exercice.xhtml": 
    			chain.doFilter(request, response); 
    			break;
    		default :
    			HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        	    httpServletResponse.sendRedirect("/JSFjack/eng/user/dashbord.xhtml");
    			break;
    		
    	}
        	    
    }

}


