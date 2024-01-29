package db.dao.user;

import java.util.List;


import db.models.User;

public interface IUser {
	public List<User> getUsers();
	
	public int addUser(User user, String password);
	
	public User getUser(int id);
	public User getUser(String username,String password);
	public int editUser(int id, User newdb_user);
	public int deleteUser(int id);

	
	
}
