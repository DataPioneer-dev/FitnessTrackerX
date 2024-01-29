package db.dao.user;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.mindrot.jbcrypt.BCrypt;

import db.conn.DbInteractor;

import db.models.User;

public class UserDao  implements IUser {
	
	private DbInteractor db ;
	
	public UserDao() {
		db = DbInteractor.getInstance();
	}

	
	@Override
	public List<User> getUsers() {
		
		List<User> users = new ArrayList<>();
		
		String sql = "SELECT * FROM users" ;
		
		ResultSet res = db.select(sql);
		
		try {
			while(res.next())
			{
				
				User user = new User();
				
				user.setId(res.getInt(1));
				user.setUsername(res.getString(2));
				user.setFirst_name(res.getString(3));
				user.setLast_name(res.getString(4));
				user.setEmail(res.getString(5));
				
				user.setSex(res.getString(7));
				user.setBirthday(res.getString(8));
				user.setHeight(res.getInt(9));
				user.setWeight(res.getInt(10));
				// 11
				user.setPhoneNumber(res.getString(12));
				user.setStatus(res.getString(13));
				user.setCity(res.getString(14));
				user.setCountry(res.getString(15));
				user.setGoalWeight(res.getInt(16));
				user.setGoal(res.getString(17));
			}
		} catch (SQLException e) {
			System.out.println("getUsers error");
			e.printStackTrace();
		}
		return users;
	}

	@Override
	public int addUser(User user,String password) {
		
		String salt = BCrypt.gensalt();
		String hashedPassword = BCrypt.hashpw(password,salt );
		
		String sql = "INSERT INTO users (username, first_name, last_name, email, password, sex, birthday, height, weight,salt ,phone, status , city , country , goalweight , goal )"
				+ "VALUES ('"+user.getUsername().toLowerCase()+"','"+user.getFirst_name().toLowerCase()+"', '"+user.getLast_name().toLowerCase()+"', '"+user.getEmail().toLowerCase()+"', '"+hashedPassword+"','"+user.getSex().toLowerCase()+"', '"+user.getBirthday()+"', "+user.getHeight()+", "+user.getWeight()+",'"+salt+"','"+user.getPhoneNumber()+"','"+user.getStatus()+"','"+user.getCity()+"','"+user.getCountry()+"','"+user.getGoalWeight()+"','"+user.getGoal()+"');";
		
		int res = db.maj(sql);
		
		return res;
	}

	@Override
	public User getUser(int id) {
		User user = null; 
		String sql = "SELECT * FROM users WHERE user_id = " + id;
		ResultSet res = db.select(sql);
		try {
			if(res.next())
			{
				user = new User();
				
				user.setId(res.getInt(1));
				user.setUsername(res.getString(2));
				user.setFirst_name(res.getString(3));
				user.setLast_name(res.getString(4));
				user.setEmail(res.getString(5));
				
				user.setSex(res.getString(7));
				user.setBirthday(res.getString(8));
				user.setHeight(res.getInt(9));
				user.setWeight(res.getInt(10));
				// 11
				user.setPhoneNumber(res.getString(12));
				user.setStatus(res.getString(13));
				user.setCity(res.getString(14));
				user.setCountry(res.getString(15));
				user.setGoalWeight(res.getInt(16));
				user.setGoal(res.getString(17));
			}
		} catch (SQLException e) {
			System.out.println("getUser error");
			e.printStackTrace();
		}
		return user ;
	}

	@Override
	public int editUser(int id,User user) {
		String sql = "UPDATE users SET username='"+user.getUsername()+"', first_name='"+user.getFirst_name()+"', last_name='"+user.getLast_name()+"', email='"+user.getEmail()+"',sex='"+user.getSex()+"', birthday='"+user.getBirthday()+"', height='"+user.getHeight()+"', weight='"+user.getWeight()+"' , phone = '"+user.getPhoneNumber()+"', status='"+user.getStatus()+"' , city = '"+user.getCity()+"', country = '"+user.getCountry()+"' , goalweight='"+user.getGoalWeight()+"' , goal = '"+user.getGoal()+"' WHERE user_id="+user.getId()+"";
		System.out.println(sql);
		int res = db.maj(sql);
		return res;	
	}

	@Override
	public int deleteUser(int id) {
		String sql = "DELETE FROM users WHERE user_id = "+id ;
		int res = db.maj(sql);
		return res;
	}


	@Override
	public User getUser(String username,String password) {
		// String hashedPassword = BCrypt.hashpw(password,salt);
		User user = null; 
		String sql = "SELECT * FROM users WHERE username = '" + username + "'";
		ResultSet res = db.select(sql);
		
		try {
			if(res.next())
			{
				
				
				String salt = res.getString(11); // 12 is the column index for salt column in the database 
				String hashedPassword = res.getString(6);
				String _hashedPassword = BCrypt.hashpw(password,salt);
				
				if( hashedPassword.equals(_hashedPassword) )
				{
					user = new User();
					
					user.setId(res.getInt(1));
					user.setUsername(res.getString(2));
					user.setFirst_name(res.getString(3));
					user.setLast_name(res.getString(4));
					user.setEmail(res.getString(5));
					
					user.setSex(res.getString(7));
					user.setBirthday(res.getString(8));
					user.setHeight(res.getInt(9));
					user.setWeight(res.getInt(10));
					// 11
					user.setPhoneNumber(res.getString(12));
					user.setStatus(res.getString(13));
					user.setCity(res.getString(14));
					user.setCountry(res.getString(15));
					user.setGoalWeight(res.getInt(16));
					user.setGoal(res.getString(17));
					
				}
				
				
			}
		} catch (SQLException e) {
			System.out.println("getUser error");
			e.printStackTrace();
		}
		return user ;
	}
	
}
