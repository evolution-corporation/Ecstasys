import * as Notifications from 'expo-notifications';
import React from "react";


const useNotificationStatus = (): [boolean | null, () => Promise<void>] => {
    const [status, setStatus] = React.useState<boolean | null>(null)

    React.useEffect(() => {
        Notifications.getPermissionsAsync().then(({ granted }) => setStatus(granted))

        return () => {

        }
    }, [])

    const getStatus = async () => {
        const state = await Notifications.getPermissionsAsync()
        setStatus(state.granted)
        if (!state.granted) alert("Чтобы сообщить об смене дыхания нужен доступ к уведомлениям")
    }

    return [status, getStatus]
}

export default useNotificationStatus