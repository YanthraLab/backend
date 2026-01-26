const { supabase } = require("../config/supabase");

class User {
  static tableName = "users";

  /**
   * Find a user by email
   * @param {string} email - User's email
   * @param {object} options - Query options (e.g., { selectPassword: true, selectRefreshToken: true })
   * @returns {Promise<object|null>} User object or null
   */
  static async findOne(filter, options = {}) {
    let query = supabase.from(this.tableName).select("*");

    if (filter.email) {
      query = query.eq("email", filter.email.toLowerCase());
    }

    if (filter.role) {
      query = query.eq("role", filter.role);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      throw error;
    }

    return data;
  }

  /**
   * Check if a user exists matching the filter
   * @param {object} filter - Filter criteria
   * @returns {Promise<boolean>} True if user exists
   */
  static async exists(filter) {
    const user = await this.findOne(filter);
    return !!user;
  }

  /**
   * Create a new user
   * @param {object} userData - User data
   * @returns {Promise<object>} Created user
   */
  static async create(userData) {
    const userToInsert = {
      email: userData.email.toLowerCase(),
      password: userData.password,
      name: userData.name,
      birthday: userData.birthday || null,
      role: userData.role || "customer",
      refresh_token: userData.refreshToken || null,
    };

    const { data, error } = await supabase
      .from(this.tableName)
      .insert([userToInsert])
      .select()
      .single();

    if (error) throw error;

    // Map snake_case to camelCase for consistency
    return {
      _id: data.id,
      id: data.id,
      email: data.email,
      password: data.password,
      name: data.name,
      birthday: data.birthday,
      role: data.role,
      refreshToken: data.refresh_token,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      save: async function () {
        return await User.updateOne({ id: this.id }, this);
      },
    };
  }

  /**
   * Update a user
   * @param {object} filter - Filter to find user
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} Update result
   */
  static async updateOne(filter, updateData) {
    let query = supabase.from(this.tableName).update({
      password: updateData.password,
      refresh_token: updateData.refreshToken,
      name: updateData.name,
      birthday: updateData.birthday,
      role: updateData.role,
    });

    if (filter.email) {
      query = query.eq("email", filter.email.toLowerCase());
    }

    if (filter.role) {
      query = query.eq("role", filter.role);
    }

    if (filter.id) {
      query = query.eq("id", filter.id);
    }

    const { data, error } = await query.select();

    if (error) throw error;

    return { acknowledged: true, modifiedCount: data.length };
  }

  /**
   * Select specific fields (mimics Mongoose .select())
   * @param {string} fields - Fields to select (e.g., "+password +refreshToken")
   * @returns {object} Query object
   */
  static select(fields) {
    return {
      _includePassword: fields.includes("+password"),
      _includeRefreshToken: fields.includes("+refreshToken") || fields.includes("+refresh_token"),
    };
  }
}

module.exports = User;
