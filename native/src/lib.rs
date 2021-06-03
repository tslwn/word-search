use neon::prelude::*;
use std::str::from_utf8;

struct Dictionary {
    words: Vec<String>,
}

impl Finalize for Dictionary {}

// internal implementation
impl Dictionary {
    fn new(str: &str) -> Self {
        let words = str.lines().map(|s| s.to_string()).collect();

        Self { words }
    }

    fn search(&self, query: String) -> Vec<String> {
        let normalized_query = query.to_ascii_uppercase();

        let mut results: Vec<String> = Vec::new();

        for word in self.words.iter() {
            if word.contains(&normalized_query) {
                results.push(word.clone().to_string());
            }
        }

        results
    }
}

// methods exposed to JavaScript
impl Dictionary {
    fn js_new(mut cx: FunctionContext) -> JsResult<JsBox<Dictionary>> {
        let buffer: Handle<JsBuffer> = cx.argument(0)?;

        let str: &str = cx.borrow(&buffer, |data| from_utf8(data.as_slice()).ok().unwrap());

        let dict = Dictionary::new(str);

        Ok(cx.boxed(dict))
    }

    fn js_search(mut cx: FunctionContext) -> JsResult<JsArray> {
        let query = cx.argument::<JsString>(0)?.value(&mut cx);

        let dict = cx
            .this()
            .downcast_or_throw::<JsBox<Dictionary>, _>(&mut cx)?;

        let matches = dict.search(query);

        let js_array = JsArray::new(&mut cx, matches.len() as u32);

        for (i, obj) in matches.iter().enumerate() {
            let js_string = cx.string(obj);

            js_array.set(&mut cx, i as u32, js_string).unwrap();
        }

        Ok(js_array)
    }
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("dictionaryNew", Dictionary::js_new)?;
    cx.export_function("dictionarySearch", Dictionary::js_search)?;

    Ok(())
}
