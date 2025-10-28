import React, { useEffect, useState } from "react"
import axiosInstance from "../utils/axioInstance"
import { FaUsers } from "react-icons/fa"
import Modal from "./Modal"
import AvatarGroup from "./AvatarGroup"

const SelectedUsers = ({ selectedUser, setSelectedUser }) => {
  const [allUsers, setAllUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempSelectedUser, setTempSelectedUser] = useState([])
  const [loading, setLoading] = useState(false)

  const getAllUsers = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get("/users/get-users")

      console.log("Users response:", response.data)

      if (response.data?.length > 0) {
        setAllUsers(response.data)
      }
    } catch (error) {
      console.log("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserSelection = (userId) => {
    setTempSelectedUser((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const handleAssign = () => {
    // Convert IDs back to user objects
    const selectedUserObjects = allUsers.filter(user => 
      tempSelectedUser.includes(user._id)
    )
    setSelectedUser(selectedUserObjects)
    setIsModalOpen(false)
  }

  // Extract user IDs and profile images from selectedUser (which contains objects)
  const selectedUserIds = selectedUser.map(user => 
    typeof user === 'string' ? user : user._id
  )

  const selectedUserAvatars = selectedUser
    .map(user => typeof user === 'string' 
      ? allUsers.find(u => u._id === user)?.profileImageUrl 
      : user.profileImageUrl
    )
    .filter(Boolean)

  useEffect(() => {
    getAllUsers()
  }, [])

  useEffect(() => {
    if (selectedUser.length === 0) {
      setTempSelectedUser([])
    }
  }, [selectedUser])

  // Sync tempSelectedUser when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTempSelectedUser(selectedUserIds)
    }
  }, [isModalOpen])

  return (
    <div className="space-y-4 mt-2">
      {selectedUserAvatars.length === 0 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 shadow-md"
          type="button"
        >
          <FaUsers className="text-lg" /> Add Members
        </button>
      )}

      {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Select User"}
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Loading users...</p>
            </div>
          )}

          {!loading && allUsers.length === 0 && (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">No users found</p>
            </div>
          )}

          {!loading && allUsers?.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b border-gray-300"
            >
              <img
                src={user?.profileImageUrl}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="flex-1">
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-[13px] text-gray-500">{user?.email}</p>
              </div>

              <input
                type="checkbox"
                checked={tempSelectedUser.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md transition-colors duration-200"
            onClick={() => setIsModalOpen(false)}
          >
            CANCEL
          </button>

          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
            onClick={handleAssign}
          >
            DONE
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default SelectedUsers