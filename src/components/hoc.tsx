type Loader = {
    loading: boolean;
}
type LoaderHook<T extends Loader> = () => T;
type LoaderComponent<T extends Loader> = (props: Omit<T, 'loading'>) => JSX.Element;

export const withLoader = <T extends Loader>(Component: LoaderComponent<T>, useLoadedValues: LoaderHook<T>) => {
    return () => {
        const { loading, ...props } = useLoadedValues();

        if (loading)
            return <h1>Loading...</h1>;

        return <Component {...props} />;
    };
};

export type LoaderHookReturn<T> = T & Loader;