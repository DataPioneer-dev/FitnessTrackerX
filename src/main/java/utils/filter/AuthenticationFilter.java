package utils.filter;

import java.io.IOException;
import java.util.Enumeration;

import db.models.User;
import jakarta.faces.context.ExternalContext;
import jakarta.faces.context.FacesContext;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebFilter("/eng/user/*") // to filter the request , based on the current session
public class AuthenticationFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
    	
    	
    	
    	HttpSession session = (HttpSession) ((HttpServletRequest) request).getSession(false);
    	
    	if(session != null && session.getAttribute("user") != null) {
    		chain.doFilter(request, response); 
    	}else {
    		HttpServletResponse httpServletResponse = (HttpServletResponse) response;
    	    httpServletResponse.sendRedirect("/JSFjack/eng/home.xhtml");
    	}

    	
        
        
    }

}
