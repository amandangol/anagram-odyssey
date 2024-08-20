#[cfg(test)]
mod tests {
    use your_crate_name::letters;
    use flate2::read::GzDecoder;
    use std::fs::File;
    use std::io::Read;

    #[test]
    fn test_letters() {
        let mut reader = GzDecoder::new(File::open("wordlist.gz").unwrap());
        let mut wordlist = String::new();
        reader
            .read_to_string(&mut wordlist)
            .expect("The wordlist was not read :(");

        let (result, _) = letters("hello", &wordlist, 3).into_serde().unwrap();
        assert_eq!(result.join(","), "hello,hell,hole,ell,hoe");

        let (result, _) = letters("bye", &wordlist, 3).into_serde().unwrap();
        assert_eq!(result.join(","), "bye");

        let (result, _) = letters("bye", &wordlist, 4).into_serde().unwrap();
        assert_eq!(result.join(","), "");
    }
}