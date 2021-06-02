use neon::prelude::*;
use std::str::from_utf8;

fn search(mut cx: FunctionContext) -> JsResult<JsArray> {
    let buffer: Handle<JsBuffer> = cx.argument(0)?;
    let pattern = cx
        .argument::<JsString>(1)?
        .value(&mut cx)
        .to_ascii_uppercase();

    let matches: Vec<&str> = cx.borrow(&buffer, |data| {
        let str = from_utf8(data.as_slice()).ok().unwrap();
        str.lines().filter(|s| s.contains(&pattern)).collect()
    });

    let js_array = JsArray::new(&mut cx, matches.len() as u32);
    for (i, obj) in matches.iter().enumerate() {
        let js_string = cx.string(obj);
        js_array.set(&mut cx, i as u32, js_string).unwrap();
    }

    Ok(js_array)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("search", search)?;
    Ok(())
}
